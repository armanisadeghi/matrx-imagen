// imagen-ui/utils/amazon/s3Utils.ts

import { S3Client, ListObjectsV2Command, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

export async function listS3Objects(bucket: string, prefix: string = '') {
    const command = new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: prefix,
    });

    try {
        const data = await s3Client.send(command);
        return data.Contents || [];
    } catch (error) {
        console.error("Error listing S3 objects:", error);
        return [];
    }
}

export async function getS3ObjectUrl(bucket: string, key: string) {
    const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
    });

    try {
        return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        return null;
    }
}
