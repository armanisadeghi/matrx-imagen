#!/bin/bash

# Display the logo again for consistency
cat resources/utils/ai_matrx_imagen.txt

### System Update ###
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y || { echo "Failed to update packages"; exit 1; }

### Python and Conda Setup ###

# Check if Python is installed, and install if it's missing
if ! command -v python3 &> /dev/null
then
    echo "Python not found, installing Python 3..."
    sudo apt-get install -y python3 python3-pip || { echo "Failed to install Python"; exit 1; }
else
    echo "Python already installed, skipping Python installation."
fi

# Install Miniconda if it's not installed
if ! command -v conda &> /dev/null
then
    echo "Conda not found, installing Miniconda..."
    wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O Miniconda3.sh
    bash Miniconda3.sh -b -p $HOME/miniconda || { echo "Failed to install Miniconda"; exit 1; }
    rm Miniconda3.sh
    export PATH="$HOME/miniconda/bin:$PATH"
else
    echo "Conda already installed, skipping Miniconda installation."
fi

# Initialize Conda and create or update the matrx-env environment
echo "Creating or updating the 'matrx-env' environment..."
source ~/miniconda3/etc/profile.d/conda.sh  # Ensure conda is in the path
conda init bash
conda config --set auto_activate_base false
conda activate || echo "Failed to activate Conda"

# Check if the matrx-env environment exists, if not, create it
if ! conda info --envs | grep 'matrx-env'; then
    conda create -n matrx-env python=3.10 -y || { echo "Failed to create matrx-env"; exit 1; }
else
    echo "Conda environment 'matrx-env' already exists, skipping creation."
fi

# Activate the environment
conda activate matrx-env || { echo "Failed to activate matrx-env"; exit 1; }

# Ensure that IPython and other dependencies are installed in the environment
echo "Installing IPython and other required dependencies in matrx-env..."
pip install ipython tqdm requests numpy || { echo "Failed to install dependencies"; exit 1; }

### Docker and Docker-Compose Setup ###

# Install Docker if not installed
if ! command -v docker &> /dev/null
then
    echo "Docker not found, installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh || { echo "Failed to install Docker"; exit 1; }
    rm get-docker.sh
else
    echo "Docker already installed, skipping Docker installation."
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found, installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '(?<=tag_name": ")[^"]*')" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose || { echo "Failed to install Docker Compose"; exit 1; }
else
    echo "Docker Compose already installed, skipping Docker Compose installation."
fi

# Restart Docker to apply updates
sudo systemctl restart docker || { echo "Failed to restart Docker"; exit 1; }

# Clean up any unused packages and system resources
sudo apt-get autoremove -y || { echo "Failed to autoremove unused packages"; exit 1; }
sudo apt-get clean || { echo "Failed to clean packages"; exit 1; }

echo "System, Python, Conda, and Docker setup completed!"
