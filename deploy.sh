#!/bin/bash

# Ensure necessary scripts are executable
chmod +x resources/utils/update_system.sh
chmod +x resources/utils/print_service_info.sh
chmod +x test_logo.sh

# Display AI Matr ASCII art
cat resources/utils/ai_matrx_imagen.txt

# Run the update script to ensure the system and Docker are up to date
resources/utils/update_system.sh

# Function to get the public IP address
get_public_ip() {
    curl -s https://api.ipify.org
}

# Set up environment variables from .env file (assuming .env is in the same directory)
export $(grep -v '^#' .env | xargs)

# Export any default values in case they are not set in the .env file
export PUBLIC_IP=$(get_public_ip)
export COMFYUI_PORT_HOST=${COMFYUI_PORT_HOST:-8188}
export JUPYTER_PORT_HOST=${JUPYTER_PORT_HOST:-8888}
export INVOKEAI_PORT_HOST=${INVOKEAI_PORT_HOST:-9090}
export COMFYUI_SYNTCTHING_UI_PORT=${COMFYUI_SYNCTHING_UI_PORT:-8385}
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

# Run the Python script inside the ComfyUI container
docker-compose exec comfyui bash -c "
pip install tqdm
python - << EOF
$(cat <<'END_PYTHON'
import os
from IPython.display import clear_output
from subprocess import call

# Your Python code goes here

if __name__ == "__main__":
    deps()
    repo()
    download_models()
    download_upscalers()
    download_inpaint()
    download_controlnet()
    sd()
END_PYTHON
)
EOF
"

# Call the print script for the final output
resources/utils/print_service_info.sh
