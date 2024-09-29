// utils/s3AccessControl.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import createClient from "@/utils/supabase/api";

// Centralized types (consider moving these to a separate types file)
interface UserGroup {
    group_id: number;
}

interface S3AccessPolicy {
    path: string;
    access_type: 'read' | 'write' | 'read_write';
    applies_to: 'public' | 'group' | 'user';
    bucket_id: number;
    user_id?: string;
    group_id?: number;
}

interface S3Bucket {
    id: number;
    name: string;
    base_path: string;
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function getS3AccessUrl(req: NextApiRequest, res: NextApiResponse, path: string, operation: 'read' | 'write'): Promise<string | null> {
    const supabase = createClient(req, res);
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.error('Error fetching user:', userError);
        return null;
    }

    try {
        // Fetch user's groups
        const { data: userGroups, error: groupsError } = await supabase
            .from('user_group_memberships')
            .select('group_id')
            .eq('user_id', user.id);

        if (groupsError) {
            throw new Error('Failed to fetch user groups');
        }

        const groupIds = userGroups?.map((ug: UserGroup) => ug.group_id) || [];

        // Fetch applicable policies
        const { data: policies, error: policiesError } = await supabase
            .from('s3_access_policies')
            .select('*')
            .or(`applies_to.eq.public,and(applies_to.eq.group,group_id.in.(${groupIds.join(',')})),and(applies_to.eq.user,user_id.eq.${user.id})`)
            .order('applies_to', { ascending: false });  // Prioritize user-specific policies

        if (policiesError) {
            throw new Error('Failed to fetch access policies');
        }

        // Find the most specific applicable policy
        const applicablePolicy = policies?.find((policy: S3AccessPolicy) =>
            path.startsWith(policy.path) &&
            (policy.access_type === 'read_write' || policy.access_type === operation)
        );

        if (!applicablePolicy) {
            return null;
        }

        // Fetch bucket information
        const { data: bucket, error: bucketError } = await supabase
            .from('s3_buckets')
            .select('*')
            .eq('id', applicablePolicy.bucket_id)
            .single();

        if (bucketError || !bucket) {
            throw new Error('Failed to fetch bucket information');
        }

        const s3Key = `${bucket.base_path}${path}`;

        // Generate pre-signed URL
        const command = operation === 'read'
            ? new GetObjectCommand({ Bucket: bucket.name, Key: s3Key })
            : new PutObjectCommand({ Bucket: bucket.name, Key: s3Key });

        return getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error('Error in getS3AccessUrl:', error);
        return null;
    }
}
