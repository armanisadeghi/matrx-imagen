import {NextPage} from 'next';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import EnvironmentManager from '@/components/EnvironmentManager';
import {createClient} from '@/utils/supabase/component'

const EnvironmentPage: NextPage = () => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const checkAuthorization = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (!user || user.user_metadata?.role !== 'superadmin') {
                router.push('/');
            } else {
                setIsAuthorized(true);
            }
        };
        checkAuthorization();
    }, [router, supabase.auth]);

    if (!isAuthorized) {
        return <div>Checking authorization...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <EnvironmentManager/>
        </div>
    );
};

export default EnvironmentPage;
