#!/bin/bash

# Check if GPUs are available
if command -v nvidia-smi &> /dev/null
then
    # GPUs are available
    GPU_COUNT=$(nvidia-smi --query-gpu=name --format=csv,noheader | wc -l)
    CUDA_VERSION=$(nvidia-smi | grep -Po "(?<=CUDA Version: )\d+\.\d+")

    # Export GPU-specific environment variables
    export USE_GPU=true
    export GPU_COUNT=$GPU_COUNT
    export CUDA_VERSION=$CUDA_VERSION
    export NVIDIA_VISIBLE_DEVICES=all

    echo "GPUs detected: $GPU_COUNT"
    echo "CUDA version: $CUDA_VERSION"
else
    # No GPUs detected
    export USE_GPU=false
    echo "No GPUs detected. Running on CPU."
fi
