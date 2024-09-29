#!/bin/bash

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found, installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh || echo "Docker installation failed, continuing..."
    rm get-docker.sh
else
    echo "Docker already installed."
fi

# Install Docker Compose if not installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found, installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '(?<=tag_name\": \")[^\"]*')" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose || echo "Failed to install Docker Compose, continuing..."
else
    echo "Docker Compose already installed."
fi

# Restart Docker service
sudo systemctl restart docker || echo "Failed to restart Docker, continuing..."

echo "Docker setup completed!"
