#!/bin/bash

# Workspace directory for models and data
WORKSPACE=${WORKSPACE:-/workspace}

# Ensure workspace directories exist
mkdir -p ${WORKSPACE}/models
mkdir -p ${WORKSPACE}/configs
mkdir -p ${WORKSPACE}/outputs
mkdir -p ${WORKSPACE}/logs

# Install any missing dependencies (optional, you can add more as required)
apt-get update
apt-get install -y wget curl git unzip

# Download Stable Diffusion Models from HuggingFace (example)
# Replace <YOUR_HUGGINGFACE_TOKEN> with your actual token and <MODEL_NAME> with the appropriate model
if [ ! -f "${WORKSPACE}/models/stable-diffusion-model.ckpt" ]; then
  echo "Downloading Stable Diffusion model from HuggingFace..."
  curl -L -H "Authorization: Bearer ${HF_TOKEN}" -o ${WORKSPACE}/models/stable-diffusion-model.ckpt "https://huggingface.co/<MODEL_NAME>/resolve/main/model.ckpt"
fi

# Example: Download InvokeAI pre-trained models if needed
if [ ! -f "${WORKSPACE}/models/invokeai-model.ckpt" ]; then
  echo "Downloading InvokeAI pre-trained model..."
  curl -L -H "Authorization: Bearer ${HF_TOKEN}" -o ${WORKSPACE}/models/invokeai-model.ckpt "https://huggingface.co/<INVOKEAI_MODEL_NAME>/resolve/main/model.ckpt"
fi

# Example: CivitAI Models Download (replace <MODEL_LINK> with actual model link)
if [ ! -f "${WORKSPACE}/models/civitai-model.ckpt" ]; then
  echo "Downloading CivitAI model..."
  curl -L -o ${WORKSPACE}/models/civitai-model.ckpt "<MODEL_LINK>"
fi

# Optional: Git clone repositories or download additional scripts for InvokeAI/ComfyUI (if needed)
# git clone https://github.com/your-model-repo.git ${WORKSPACE}/models/your-model-repo

# Set permissions on workspace directory
chmod -R 777 ${WORKSPACE}

echo "Provisioning complete."
