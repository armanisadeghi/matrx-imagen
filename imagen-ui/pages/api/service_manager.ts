// imagen-ui/pages/api/service_manager.ts

import { NextApiRequest, NextApiResponse } from 'next';
import createClient from "@/utils/supabase/api";

const SERVICE_MANAGER_URL = 'http://localhost:5000'; // Assuming service_manager.py runs on port 5000

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const supabase = createClient(req, res);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.user_metadata?.role !== 'superadmin') {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    if (req.method === 'POST' && req.query.action === 'install') {
        const { service_name, env_vars } = req.body;

        try {
            const response = await fetch(`${SERVICE_MANAGER_URL}/install_service`, {
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
    } else if (req.method === 'GET' && req.query.action === 'env_vars') {
        try {
            const response = await fetch(`${SERVICE_MANAGER_URL}/get_env_vars`);
            if (!response.ok) {
                throw new Error('Failed to fetch environment variables');
            }
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching environment variables:', error);
            res.status(500).json({ message: 'Error fetching environment variables' });
        }
    } else if (req.method === 'POST' && req.query.action === 'update_env_vars') {
        try {
            const response = await fetch(`${SERVICE_MANAGER_URL}/update_env_vars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(req.body)
            });
            if (!response.ok) {
                throw new Error('Failed to update environment variables');
            }
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            console.error('Error updating environment variables:', error);
            res.status(500).json({ message: 'Error updating environment variables' });
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
