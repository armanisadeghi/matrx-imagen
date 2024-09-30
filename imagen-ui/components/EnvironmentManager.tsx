// imagen-ui/components/EnvironmentManager.tsx

import React, { useState, useEffect } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {Alert} from "@/components/ui/alert";


const availableServices = [
    { name: 'frontend', label: 'Frontend' },
    { name: 'vscode-server', label: 'VS Code Server' },
    { name: 'jupyterlab-superadmin', label: 'JupyterLab (Superadmin)' },
    { name: 'jupyterlab', label: 'JupyterLab (Limited)' },
    { name: 'comfyui', label: 'ComfyUI' },
    { name: 'invokeai', label: 'InvokeAI' },
    { name: 'supabase', label: 'Supabase' },
    { name: 'service-manager', label: 'Service Manager' },
];

const EnvironmentManager: React.FC = () => {
    const [globalEnvVars, setGlobalEnvVars] = useState<Record<string, string>>({});
    const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
    const [serviceEnvVars, setServiceEnvVars] = useState<Record<string, Record<string, string>>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetchEnvVars();
    }, []);

    const fetchEnvVars = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/service_manager?action=env_vars');
            if (!response.ok) {
                throw new Error('Failed to fetch environment variables');
            }
            const data = await response.json();
            setGlobalEnvVars(data);
        } catch (err) {
            setError('Failed to fetch environment variables');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGlobalEnvVarChange = (key: string, value: string) => {
        setGlobalEnvVars(prev => ({ ...prev, [key]: value }));
    };

    const handleServiceToggle = (serviceName: string) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceName]: !prev[serviceName]
        }));
    };

    const handleServiceEnvVarChange = (serviceName: string, key: string, value: string) => {
        setServiceEnvVars(prev => ({
            ...prev,
            [serviceName]: {
                ...prev[serviceName],
                [key]: value
            }
        }));
    };

    const handleAddServiceEnvVar = (serviceName: string) => {
        setServiceEnvVars(prev => ({
            ...prev,
            [serviceName]: {
                ...prev[serviceName],
                '': ''
            }
        }));
    };

    const handleInstall = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);
        try {
            // Update global environment variables
            await fetch('/api/service_manager?action=update_env_vars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(globalEnvVars)
            });

            // Install selected services
            for (const service of Object.keys(selectedServices)) {
                if (selectedServices[service]) {
                    const response = await fetch('/api/service_manager?action=install', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            service_name: service,
                            env_vars: serviceEnvVars[service] || {}
                        })
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to install ${service}`);
                    }
                }
            }
            setSuccess(true);
        } catch (err) {
            setError('Failed to update environment variables or install services');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <Alert variant="destructive">{error}</Alert>;

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Environment Manager</h1>

            <h2 className="text-xl font-semibold">Global Environment Variables</h2>
            {Object.entries(globalEnvVars).map(([key, value]) => (
                <div key={key} className="flex space-x-2">
                    <Input
                        value={key}
                        disabled
                        className="w-1/3"
                    />
                    <Input
                        value={value}
                        onChange={(e) => handleGlobalEnvVarChange(key, e.target.value)}
                        className="w-2/3"
                        type={key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') ? 'password' : 'text'}
                    />
                </div>
            ))}

            <h2 className="text-xl font-semibold">Select Services to Install</h2>
            {availableServices.map(service => (
                <div key={service.name} className="service-option">
                    <Checkbox
                        checked={selectedServices[service.name] || false}
                        onCheckedChange={() => handleServiceToggle(service.name)}
                    />
                    <label>{service.label}</label>
                    {selectedServices[service.name] && (
                        <div className="env-vars-section ml-4">
                            <h3 className="text-lg font-medium">Environment Variables for {service.label}</h3>
                            {Object.entries(serviceEnvVars[service.name] || {}).map(([key, value], index) => (
                                <div key={index} className="flex space-x-2">
                                    <Input
                                        placeholder="Environment Variable Key"
                                        value={key}
                                        onChange={(e) => handleServiceEnvVarChange(service.name, e.target.value, value)}
                                        className="w-1/3"
                                    />
                                    <Input
                                        placeholder="Environment Variable Value"
                                        value={value}
                                        onChange={(e) => handleServiceEnvVarChange(service.name, key, e.target.value)}
                                        className="w-2/3"
                                    />
                                </div>
                            ))}
                            <Button onClick={() => handleAddServiceEnvVar(service.name)} className="mt-2">Add Environment Variable</Button>
                        </div>
                    )}
                </div>
            ))}

            <Button onClick={handleInstall} disabled={isLoading} className="mt-4">
                {isLoading ? 'Updating and Installing...' : 'Update Environment and Install Services'}
            </Button>
            {success && <Alert>Environment variables updated and services installed successfully!</Alert>}
        </div>
    );
};

export default EnvironmentManager;
