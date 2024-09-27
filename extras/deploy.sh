#!/bin/bash

# Step 1: Clone the ComfyUI repository if it doesn't exist
if [ ! -d "comfyui" ]; then
  echo "Cloning the ComfyUI repository..."
  git clone https://github.com/ai-dock/comfyui.git
fi

# Step 2: Ensure the build directory exists
echo "Checking for the build directory..."
if [ ! -d "comfyui/build" ]; then
  echo "Creating build directory..."
  mkdir -p comfyui/build
fi

# Step 3: Copy the docker-compose.yaml to the comfyui directory
echo "Copying docker-compose.yaml to the comfyui directory..."
cp ./docker-compose.yaml comfyui/

# Step 4: Build and run Docker containers from within the comfyui directory
echo "Building and starting Docker containers..."
cd comfyui || exit
docker-compose up --build -d

# Step 5: Run the Python script (cmf.py)
echo "Running the cmf.py script..."
cd ..
python3 ./cmf.py

# Step 6: Provide links to the mapped ports
echo "=============================   MATRX IMAGE GENERATION   ============================="
echo "Setup completed! You can access the services via the following links:"
echo "======================================================================================="
echo " "
echo "--------------           ComfyUI           --------------"
echo "ComfyUI Service Portal: http://147.185.40.26:20103"
echo "ComfyUI Jupyter: http://147.185.40.26:20020"
echo "ComfyUI Syncthing UI: http://147.185.40.26:20105"
echo " "
echo "--------------           InvokeAI           --------------"
echo "InvokeAI Service Portal: http://147.185.40.26:20107"
echo "InvokeAI Jupyter: http://147.185.40.26:20022"
echo " "
echo "======================================================================================="