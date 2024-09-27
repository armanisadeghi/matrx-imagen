Here is your organized `.md` file with a proper structure, and any unclear points have been flagged with a `(!)` comment for you to review later:

```md
# Deployment Notes

## Option 1: All-in-one

```bash
scp -P 20004 "D:\app_dev\comfy-server-setup\*" user@147.185.40.26:~/; ssh -p 20004 user@147.185.40.26 "chmod +x ~/deploy.sh && ~/deploy.sh"
```

## Option 2: One by one

1. Upload the files:
   ```bash
   scp -P 20004 "D:\app_dev\comfy-server-setup\*" user@147.185.40.26:~/
   ```
2. Run the script on the server:
   ```bash
   ssh -p 20004 user@147.185.40.26 "chmod +x ~/deploy.sh && ~/deploy.sh"
   ```

## Option 3: Using PowerShell and Server

### Powershell:
1. Create a directory on the server and upload the files:
   ```bash
   ssh -p 20004 user@147.185.40.26 "mkdir -p ~/server-setup/" ; scp -P 20004 -r "D:\app_dev\comfy-server-setup\*" user@147.185.40.26:~/server-setup/
   ```

2. Connect to the server:
   ```bash
   ssh -p 20004 user@147.185.40.26
   ```

### On the Server:
1. Change to the setup directory:
   ```bash
   cd ~/server-setup
   ```
2. Make the deployment script executable:
   ```bash
   chmod +x deploy.sh
   ```
3. Run the deployment script:
   ```bash
   ./deploy.sh
   ```

---

## Ports

Port forwarding configuration from external ports to internal services:

| External Port | Internal Port | Service Description                   |
|---------------|---------------|---------------------------------------|
| 20004         | 22            | SSH (existing)                        |
| 20005         | 3389          | RDP (existing)                        |
| 20020         | 8888          | Jupyter (ComfyUI)                     |
| 20022         | 9090          | InvokeAI Host Port                    |
| 20023         | 7777          | (!) Check if this port is used        |
| 20103         | 1111          | (!) Is this another ComfyUI Portal    |
| 20104         | 8188          | ComfyUI Host Port                     |
| 20105         | 8384          | ComfyUI Syncthing UI                  |
| 20106         | 22999         | ComfyUI Syncthing Transport           |
| 20107         | 1113          | (!) additional service or wrong       |
| 20110         | 1115          | (!) additional service or wrong       |

---

## Service Mappings

| Service Name                | Docker Port | Mapped Port on Server |
|-----------------------------|-------------|------------------------|
| SSH (existing)              | 22          | 20004                  |
| RDP (existing)              | 3389        | 20005                  |
| Jupyter (ComfyUI)           | 8888        | 20101                  |
| InvokeAI Host Port          | 9090        | 20022                  |
| ComfyUI Service Portal      | 1111        | 20024                  |
| ComfyUI Host Port           | 8188        | 20025                  |
| ComfyUI Syncthing UI        | 8384        | 20026                  |
| ComfyUI Syncthing Transport | 22999       | 20027                  |
| InvokeAI Service Portal     | 1111        | 20028                  |
| InvokeAI Syncthing UI       | 8384        | 20029                  |
| InvokeAI Syncthing Transport| 22999       | 20030                  |

---

> (!) Review flagged items for correctness and ensure that the mappings and services are accurate.

```