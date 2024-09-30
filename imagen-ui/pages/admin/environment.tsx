// imagen-ui/pages/admin/environment.tsx

import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import EnvironmentManager from '../../components/EnvironmentManager';
import { createClient } from '../../utils/supabase/component';

const EnvironmentPage: NextPage = () => {
    const [authStatus, setAuthStatus] = useState<string>('Checking authorization...');
    const [userDetails, setUserDetails] = useState<string>('');
    const supabase = createClient();

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();

                if (error) {
                    console.error('Supabase error:', error);
                    setAuthStatus(`Auth error: ${error.message}`);
                    return;
                }

                if (!user) {
                    console.log('No user found');
                    setAuthStatus('No user found');
                    return;
                }

                console.log('User:', user);
                setUserDetails(JSON.stringify(user, null, 2));

                if (user.user_metadata?.role !== 'superadmin') {
                    console.log('User is not superadmin');
                    setAuthStatus(`User role: ${user.user_metadata?.role || 'undefined'}`);
                } else {
                    console.log('User is superadmin');
                    setAuthStatus('User is authorized as superadmin');
                }
            } catch (error) {
                console.error('Error checking authorization:', error);
                setAuthStatus(`Caught error: ${error}`);
            }
        };

        checkAuthorization();
    }, [supabase.auth]);

    return (
        <div className="container mx-auto p-4">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                <p className="font-bold">Authorization Status (Testing Mode)</p>
                <p>{authStatus}</p>
                <pre className="mt-2 text-xs">{userDetails}</pre>
            </div>
            <EnvironmentManager />
        </div>
    );
};

export default EnvironmentPage;
