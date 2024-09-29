'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { createClient } from '@/utils/supabase/component';


const JupyterButton: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState<any>(null);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) {
                console.error('Error fetching session:', error);
            } else {
                setSession(session);
            }
        };

        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const handleClick = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/jupyter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to connect to JupyterLab');
            }

            const result = await response.json();

            if (result.url) {
                window.open(result.url, '_blank');
            } else {
                throw new Error('No URL returned from JupyterLab');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to JupyterLab.');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return null; // Don't render the button if there's no session
    }

    return (
        <Button onClick={handleClick} disabled={loading} className="w-full">
            {loading ? 'Connecting to JupyterLab...' : 'Open JupyterLab'}
        </Button>
    );
};

export default JupyterButton;
