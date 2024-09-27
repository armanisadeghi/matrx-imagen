#!/bin/bash

# Display the logo again for consistency
cat resources/utils/ai_matrx_imagen.txt

# Ensure the system is updated
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y || echo "System package update failed, continuing..."

# Install Python and pip if missing
if ! command -v python3 &> /dev/null; then
    echo "Python not found, installing Python 3..."
    sudo apt-get install -y python3 python3-pip || { echo "Failed to install Python"; exit 1; }
else
    echo "Python already installed."
fi

# Install Miniconda if missing
if ! command -v conda &> /dev/null; then
    echo "Conda not found, installing Miniconda..."
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O Miniconda3.sh
    bash Miniconda3.sh -b -p $HOME/miniconda || { echo "Failed to install Miniconda"; exit 1; }
    rm Miniconda3.sh
    export PATH="$HOME/miniconda/bin:$PATH"
else
    echo "Conda already installed."
fi

# Initialize Conda and setup the environment
source ~/miniconda3/etc/profile.d/conda.sh  # Ensure conda is in the path
conda init bash
conda config --set auto_activate_base false
echo "Creating or updating the 'matrx-env' environment..."
if ! conda info --envs | grep 'matrx-env'; then
    conda create -n matrx-env python=3.10 -y || { echo "Failed to create matrx-env"; exit 1; }
else
    echo "Conda environment 'matrx-env' already exists."
fi

# Activate the environment
conda activate matrx-env || { echo "Failed to activate matrx-env"; exit 1; }

# Call the Python dependency setup script
bash python_dependencies.sh

# Docker and Docker-Compose Setup
if ! command -v docker &> /dev/null; then
    echo "Docker not found, installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh || echo "Docker installation failed, continuing..."
    rm get-docker.sh
else
    echo "Docker already installed."
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found, installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '(?<=tag_name": ")[^"]*')" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose || echo "Failed to install Docker Compose, continuing..."
else
    echo "Docker Compose already installed."
fi

sudo systemctl restart docker || echo "Failed to restart Docker, continuing..."

# Clean up
sudo apt-get autoremove -y || echo "Failed to autoremove unused packages, continuing..."
sudo apt-get clean || echo "Failed to clean packages, continuing..."

echo "Setup completed!"
