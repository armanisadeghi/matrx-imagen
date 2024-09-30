# service_manager.py
import docker
import os
from flask import Flask, request, jsonify

app = Flask(__name__)
client = docker.from_env()

@app.route('/install_service', methods=['POST'])
def install_service():
    service_name = request.json['service_name']
    env_vars = request.json.get('env_vars', {})

    # Define service configurations
    services = {
        'vscode-server': {
            'image': 'vscode-server:latest',
            'ports': {'8080/tcp': 20047},
            'volumes': {'/workspace': {'bind': '/workspace', 'mode': 'rw'}},
        },
        'jupyterlab-superadmin': {
            'image': 'jupyterlab-superadmin:latest',
            'ports': {'8888/tcp': 20029},
            'volumes': {'/workspace': {'bind': '/workspace', 'mode': 'rw'}},
        },
        # Add other services here
    }

    if service_name not in services:
        return jsonify({'error': 'Service not found'}), 404

    service_config = services[service_name]

    # Update environment variables
    service_config['environment'] = env_vars

    # Start the container
    container = client.containers.run(
        service_config['image'],
        detach=True,
        name=service_name,
        ports=service_config['ports'],
        volumes=service_config['volumes'],
        environment=service_config['environment'],
        network='app-network'
    )

    return jsonify({'message': f'Service {service_name} installed successfully'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
