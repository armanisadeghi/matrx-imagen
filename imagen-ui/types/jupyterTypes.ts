// types/jupyterTypes.ts

export interface DirectoryAccess {
    directory_path: string;
}

export interface User {
    id: string;
    user_metadata?: {
        access_level?: string;
    };
}

export interface JupyterResponse {
    url: string;
}
