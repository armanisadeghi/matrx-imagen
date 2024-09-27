#!/bin/bash

# Update system and install basic utilities like git and curl
echo "Updating system and installing basic utilities (git, curl)..."
sudo apt-get update && sudo apt-get install -y git curl

# Clone the repository that contains the core files
echo "Cloning the repository..."
git clone https://github.com/armanisadeghi/matrx-imagen.git

# Navigate to the cloned repository directory
cd matrix-imagen

# Ensure deploy.sh is executable
chmod +x deploy.sh

# Run the deploy script
./deploy.sh
