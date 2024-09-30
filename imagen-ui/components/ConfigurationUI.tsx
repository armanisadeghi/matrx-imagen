'use client';

import { useState } from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const ServiceSelector = () => {
    const [selectedServices, setSelectedServices] = useState<{ [key: string]: boolean }>({});
    const [envVars, setEnvVars] = useState<{ [key: string]: { [key: string]: string } }>({});

    const handleServiceToggle = (serviceName: string) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceName]: !prev[serviceName]
        }));
    };

    const handleEnvVarChange = (serviceName: string, key: string, value: string) => {
        setEnvVars(prev => ({
            ...prev,
            [serviceName]: {
                ...prev[serviceName],
                [key]: value
            }
        }));
    };

    const handleAddEnvVar = (serviceName: string) => {
        setEnvVars(prev => ({
            ...prev,
            [serviceName]: {
                ...prev[serviceName],
                '': ''  // Initialize with empty key-value pair for a new environment variable
            }
        }));
    };

    const handleInstall = async () => {
        for (const service of Object.keys(selectedServices)) {
            if (selectedServices[service]) {
                try {
                    const response = await fetch('/api/install_service', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            service_name: service,
                            env_vars: envVars[service] || {}
                        })
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to install ${service}`);
                    }
                } catch (error) {
                    console.error(`Error installing ${service}:`, error);
                }
            }
        }
    };

    return (
        <div>
            <h2>Select Services to Install</h2>
            {availableServices.map(service => (
                <div key={service.name} className="service-option">
                    <Checkbox
                        checked={selectedServices[service.name] || false}
                        onCheckedChange={() => handleServiceToggle(service.name)}
                    />
                    <label>{service.label}</label>
                    {selectedServices[service.name] && (
                        <div className="env-vars-section">
                            <h4>Environment Variables for {service.label}</h4>
                            {Object.keys(envVars[service.name] || {}).map((key, index) => (
                                <div key={index} className="env-var-inputs">
                                    <Input
                                        placeholder="Environment Variable Key"
                                        value={key}
                                        onChange={(e) => handleEnvVarChange(service.name, e.target.value, envVars[service.name][key])}
                                    />
                                    <Input
                                        placeholder="Environment Variable Value"
                                        value={envVars[service.name][key]}
                                        onChange={(e) => handleEnvVarChange(service.name, key, e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button onClick={() => handleAddEnvVar(service.name)}>Add Environment Variable</Button>
                        </div>
                    )}
                </div>
            ))}
            <Button onClick={handleInstall}>Install Selected Services</Button>
        </div>
    );
};

export default ServiceSelector;
