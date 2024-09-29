// pages/api/s3Access.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { getS3AccessUrl } from '@/utils/amazon/s3AccessControl';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { path, operation } = req.body;

    if (!path || !operation) {
        return res.status(400).json({ message: 'Missing path or operation' });
    }

    const url = await getS3AccessUrl(req, res, path, operation);

    if (!url) {
        return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({ url });
}
