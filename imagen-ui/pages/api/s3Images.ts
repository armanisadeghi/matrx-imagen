// pages/api/s3Images.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { listS3Objects, getS3ObjectUrl } from '@/utils/amazon/s3Utils';
import createClient from "@/utils/supabase/api";

interface S3Image {
    key: string;
    url: string;
}

interface ImageLevel {
    level: string;
    images: S3Image[];
}

interface UserGroup {
    group_id: number;
}

const buckets = {
    user: process.env.S3_USER_BUCKET!,
    guest: process.env.S3_GUEST_BUCKET!,
    basic: process.env.S3_BASIC_BUCKET!,
    intermediate: process.env.S3_INTERMEDIATE_BUCKET!,
    advanced: process.env.S3_ADVANCED_BUCKET!,
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ images: ImageLevel[] } | { message: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const supabase = createClient(req, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Fetch user's access level
        const { data: userGroups, error } = await supabase
            .from('user_group_memberships')
            .select('group_id')
            .eq('user_id', user.id);

        if (error) {
            throw new Error('Failed to fetch user groups');
        }

        const accessLevels = ['guest'];
        if (userGroups && userGroups.length > 0) {
            if (userGroups.some((ug: UserGroup) => ug.group_id === 2)) accessLevels.push('basic');
            if (userGroups.some((ug: UserGroup) => ug.group_id === 3)) accessLevels.push('intermediate');
            if (userGroups.some((ug: UserGroup) => ug.group_id === 4)) accessLevels.push('advanced');
        }

        const images: ImageLevel[] = await Promise.all(
            [...accessLevels, 'user'].map(async (level) => {
                const bucket = buckets[level as keyof typeof buckets];
                const prefix = level === 'user' ? `${user.id}/` : '';
                const objects = await listS3Objects(bucket, prefix);
                const urls: S3Image[] = await Promise.all(
                    objects
                        .filter(obj => obj.Key?.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/))
                        .map(async (obj) => ({
                            key: obj.Key!,
                            url: await getS3ObjectUrl(bucket, obj.Key!) || ''
                        }))
                );
                return { level, images: urls };
            })
        );

        res.status(200).json({ images });
    } catch (error) {
        console.error('Error fetching S3 images:', error);
        res.status(500).json({ message: 'Error fetching images' });
    }
}
