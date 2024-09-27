#!/bin/bash

# Display the logo again for consistency
cat resources/utils/ai_matrx_imagen.txt

# Update the system
echo "Updating system packages..."
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null
then
    echo "Docker not found, installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "Docker already installed, skipping..."
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null
then
    echo "Docker Compose not found, installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '(?<=tag_name": ")[^"]*')" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed, skipping..."
fi

# Restart Docker to apply updates
sudo systemctl restart docker

# Clean up any unused packages and system resources
sudo apt-get autoremove -y
sudo apt-get clean
