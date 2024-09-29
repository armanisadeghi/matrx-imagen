// imagen-ui/components/S3ImageGallery.tsx

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/component';

interface S3Image {
    key: string;
    url: string;
}

interface ImageLevel {
    level: string;
    images: S3Image[];
}

const S3ImageGallery: React.FC = () => {
    const [images, setImages] = useState<ImageLevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/s3Images');
                if (!response.ok) {
                    throw new Error('Failed to fetch images');
                }
                const data = await response.json();
                setImages(data.images);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto px-4">
            {images.map((levelImages: ImageLevel) => (
                <div key={levelImages.level} className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 capitalize">{levelImages.level} Images</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {levelImages.images.map((image: S3Image) => (
                            <div key={image.key} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <img src={image.url} alt={image.key} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <p className="text-sm text-gray-600 truncate">{image.key}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default S3ImageGallery;
