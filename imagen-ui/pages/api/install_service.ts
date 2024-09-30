// pages/api/install_service.ts

import { NextApiRequest, NextApiResponse } from 'next';
import createClient from "@/utils/supabase/api";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const supabase = createClient(req, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== 'superadmin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    const { service_name, env_vars } = req.body;

    try {
        const response = await fetch('http://service-manager:5000/install_service', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service_name, env_vars })
        });

        if (!response.ok) {
            throw new Error('Failed to install service');
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error('Error installing service:', error);
        res.status(500).json({ message: 'Error installing service' });
    }
}
