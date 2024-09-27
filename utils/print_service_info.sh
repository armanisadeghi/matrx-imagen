#!/bin/bash

# Display the logo again
echo -e "\e[34m$(cat resources/utils/ai_matrx_imagen.txt)\e[0m"

# Function to get the public IP address
get_public_ip() {
    curl -s https://api.ipify.org
}

# Get the public IP
export PUBLIC_IP=$(get_public_ip)

# Print useful information with colors
echo -e "\e[34m=============================   MATRIX IMAGE GENERATION   =============================\e[0m"
echo -e "\e[32mSetup completed! You can access the services via the following links:\e[0m"
echo -e "\e[34m=======================================================================================\e[0m"
echo " "
echo -e "\e[33m--------------           ComfyUI           --------------\e[0m"
echo -e "\e[32mComfyUI Service Portal:\e[0m http://$PUBLIC_IP:$COMFYUI_PORT_HOST"
echo -e "\e[32mComfyUI Jupyter:\e[0m http://$PUBLIC_IP:$JUPYTER_PORT_HOST"
echo -e "\e[32mComfyUI Syncthing UI:\e[0m http://$PUBLIC_IP:$COMFYUI_SYNTCTHING_UI_PORT"
echo -e "\e[32mComfyUI Syncthing Transport:\e[0m $PUBLIC_IP:$COMFYUI_SYNTCTHING_TRANSPORT_PORT"
echo -e "\e[32mSSH for ComfyUI:\e[0m ssh -p $SSH_PORT_COMFYUI root@$PUBLIC_IP"
echo " "
echo -e "\e[33m--------------           InvokeAI           --------------\e[0m"
echo -e "\e[32mInvokeAI Service Portal:\e[0m http://$PUBLIC_IP:$INVOKEAI_PORT_HOST"
echo -e "\e[32mInvokeAI Jupyter:\e[0m http://$PUBLIC_IP:$JUPYTER_PORT_HOST"
echo -e "\e[32mInvokeAI Syncthing UI:\e[0m http://$PUBLIC_IP:$INVOKEAI_SYNTCTHING_UI_PORT"
echo -e "\e[32mInvokeAI Syncthing Transport:\e[0m $PUBLIC_IP:$INVOKEAI_SYNTCTHING_TRANSPORT_PORT"
echo -e "\e[32mSSH for InvokeAI:\e[0m ssh -p $SSH_PORT_INVOKEAI root@$PUBLIC_IP"
echo " "
echo -e "\e[34m=======================================================================================\e[0m"
