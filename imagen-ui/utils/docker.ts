// /utils/docker.ts
import { exec } from 'child_process';

export const spawnJupyterContainer = async (userId: string, allowedDirectories: string[]): Promise<string> => {
    // Construct Docker volume mounts based on allowed directories
    const volumeArgs = allowedDirectories.map(dir => `-v ${dir}:${dir}`).join(' ');

    // Generate a random token for Jupyter
    const token = Math.random().toString(36).substring(2, 15);

    // Docker command to run JupyterLab container with mounted directories, user ID, and token for access
    const command = `
    docker run -d ${volumeArgs} -e JUPYTER_TOKEN=${token} -e JUPYTER_USER_ID=${userId} -p 8888:8888 jupyter/base-notebook
  `;

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout) => {
            if (error) {
                return reject(error);
            }
            // Assuming we know the container's URL
            resolve(`http://localhost:8888/?token=${token}`);
        });
    });
};


