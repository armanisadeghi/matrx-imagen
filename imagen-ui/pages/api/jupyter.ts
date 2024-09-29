// /pages/api/jupyter.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { spawnJupyterContainer } from '@/utils/docker';
import createClient from "@/utils/supabase/api";

interface DirectoryAccess {
    directory_path: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Create Supabase client
    const supabase = createClient(req, res);

    try {
        // Get user session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch user's access level from user metadata
        const accessLevel = user.user_metadata?.access_level || 'basic';

        // Fetch directories for the user's access level from Supabase
        const { data: directories, error: dirError } = await supabase
            .from('directory_access')
            .select('directory_path')
            .eq('role', accessLevel);

        if (dirError) {
            throw new Error('Failed to fetch directories');
        }

        if (!directories) {
            throw new Error('No directories found for the user\'s access level');
        }

        let allowedDirectories = directories.map((d: DirectoryAccess) => d.directory_path);

        // If user is admin, filter out forbidden directories
        if (accessLevel === 'admin') {
            const { data: forbidden, error: forbiddenError } = await supabase
                .from('directory_access')
                .select('directory_path')
                .eq('role', 'forbidden');

            if (forbiddenError) {
                throw new Error('Failed to fetch forbidden directories');
            }

            if (forbidden) {
                const forbiddenDirs = forbidden.map((d: DirectoryAccess) => d.directory_path);
                allowedDirectories = allowedDirectories.filter(dir => !forbiddenDirs.includes(dir));
            }
        }

        // Spin up JupyterLab container with the correct directories
        const jupyterUrl = await spawnJupyterContainer(user.id, allowedDirectories);

        // Return the JupyterLab URL
        res.status(200).json({ url: jupyterUrl });
    } catch (error) {
        console.error('Error spawning Jupyter:', error);
        res.status(500).json({ message: 'Error connecting to JupyterLab.' });
    }
}
