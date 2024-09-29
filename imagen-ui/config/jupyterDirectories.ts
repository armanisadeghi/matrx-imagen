// /config/jupyterDirectories.ts

export const directoryMap: Record<string, string[]> = {
    basic: [
        '/data/shared',        // Shared directory for basic users
        '/data/reports'        // Basic users can access the reports directory
    ],
    intermediate: [
        '/data/shared',        // Intermediate users inherit basic
        '/data/reports',
        '/data/intermediate',  // Intermediate-only directory
    ],
    advanced: [
        '/data/shared',
        '/data/reports',
        '/data/intermediate',
        '/data/advanced',      // Advanced-specific directory
    ],
    admin: [
        '/data/shared',
        '/data/reports',
        '/data/intermediate',
        '/data/advanced',
        // Admin can access all except the forbidden directory
    ],
    superuser: [
        '/data',  // Superuser gets access to everything (root /data)
    ],
    forbidden: [
        '/data/private'  // Example forbidden directory for Admin
    ]
};
