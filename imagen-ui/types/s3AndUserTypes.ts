// types/s3AndUserTypes.ts

export interface UserGroup {
    group_id: number;
}

export interface S3AccessPolicy {
    path: string;
    access_type: 'read' | 'write' | 'read_write';
    applies_to: 'public' | 'group' | 'user';
    bucket_id: number;
    user_id?: string;
    group_id?: number;
}

export interface S3Bucket {
    id: number;
    name: string;
    base_path: string;
}

export interface S3Image {
    key: string;
    url: string;
}

export interface ImageLevel {
    level: string;
    images: S3Image[];
}
