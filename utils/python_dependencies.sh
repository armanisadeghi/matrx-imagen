#!/bin/bash

# Activate Conda environment if not already active
source ~/miniconda3/etc/profile.d/conda.sh
conda activate matrx-env || { echo "Failed to activate matrx-env"; exit 1; }

# Install system-level dependencies if not present
echo "Installing system-level dependencies (git, wget, gperftools, and libraries)..."
sudo apt-get install -y git wget libtcmalloc-minimal4 gperftools || {
    echo "System package installation failed, continuing...";
}

# Install Python dependencies using Conda where possible to avoid conflicts
echo "Installing Python dependencies using Conda and pip..."

# First try to install via Conda to avoid dependency conflicts
conda install -y opencv insightface rembg numba scikit-image ultralytics \
                 scipy aiohttp kornia matplotlib timm filetype \
                 slugify huggingface_hub diffusers accelerate xformers \
                 -c conda-forge || echo "Conda package installation failed, continuing..."

# Remaining dependencies can be installed via pip
pip install safetensors einops torchsde spandrel vispy imageio_ffmpeg \
            pykalman onediff onediffx nexfort requests tqdm zipfile \
            python-dotenv GitPython ipython --no-cache-dir || echo "Pip package installation failed, continuing..."

echo "Python environment setup completed!"
