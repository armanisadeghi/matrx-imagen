#!/bin/bash

# Ensure necessary scripts are executable
chmod +x utils/update_system.sh
chmod +x utils/gpu_check.sh
chmod +x utils/print_service_info.sh
chmod +x test_logo.sh

cat utils/ai_matrx_logo.txt

# Update the system: Apt, Python, Conda, and Docker.
utils/update_system.sh

# Check if GPUs are available and how many are present
utils/gpu_check.sh

# Get the public IP address
get_public_ip() {
    curl -s https://api.ipify.org
}

# Set up environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Export any default values in case they are not set in the .env file
export PUBLIC_IP=$(get_public_ip)
export COMFYUI_PORT_HOST=${COMFYUI_PORT_HOST:-8188}
export JUPYTER_PORT_HOST=${JUPYTER_PORT_HOST:-8888}
export INVOKEAI_PORT_HOST=${INVOKEAI_PORT_HOST:-9090}
export COMFYUI_SYNTCTHING_UI_PORT=${COMFYUI_SYNTCTHING_UI_PORT:-8385}
export COMFYUI_SYNTCTHING_TRANSPORT_PORT=${COMFYUI_SYNCTHING_TRANSPORT_PORT:-22998}
export INVOKEAI_SYNTCTHING_UI_PORT=${INVOKEAI_SYNTCTHING_UI_PORT:-8386}
export INVOKEAI_SYNTCTHING_TRANSPORT_PORT=${INVOKEAI_SYNCTHING_TRANSPORT_PORT:-22997}
export SSH_PORT_COMFYUI=${SSH_PORT_HOST:-2223}
export SSH_PORT_INVOKEAI=${SSH_PORT_HOST:-2224}

# Build and start the Docker containers
docker-compose up -d --build

# Wait for ComfyUI to be set up (adjust the sleep time as needed)
echo "Waiting for ComfyUI to set up..."
sleep 60

# Activate Conda environment and run the Python script
echo "Activating Conda environment and running the Python script..."
source ~/miniconda3/etc/profile.d/conda.sh
conda activate matrx-env || { echo "Failed to activate matrx-env"; exit 1; }

# Run the Python script
python3 resources/utils/cmf.py

# Call the print script for the final output
resources/utils/print_service_info.sh
