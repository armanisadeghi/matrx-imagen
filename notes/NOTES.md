# Understanding the `docker-compose.yaml` File and Related Files

## `.env` File
- If a `.env` file is placed in the same directory as the `docker-compose.yaml` file, the environment variable values will be automatically loaded into the Docker containers when running `docker-compose`.
- Example of environment variable usage in `docker-compose.yaml`:
  ```yaml
  ports:
    - "${INVOKEAI_PORT_HOST:-9090}:${INVOKEAI_PORT_HOST:-9090}"
  ```

## Port Mappings

The `docker-compose.yaml` file typically defines port mappings in the format `HOST_PORT:CONTAINER_PORT`. Here’s what that means:

- **HOST_PORT:CONTAINER_PORT**
    - The first number (left of the colon) is the port on your host machine (i.e., the server where Docker is running).
    - The second number (right of the colon) is the port inside the Docker container.
    - Example mappings:
      - `1113:1111` - InvokeAI service portal: Host port 1113 maps to container port 1111.
      - `2224:22` - SSH access: Host port 2224 maps to container port 22.

### Example Port Mappings:
- **${INVOKEAI_PORT_HOST:-9090}:${INVOKEAI_PORT_HOST:-9090}**
  - InvokeAI main service: Host and container ports are both set to the value of `INVOKEAI_PORT_HOST`, with a default value of `9090`.

### Host to Container Mappings:

| Host Port | Container Port | Description                               |
|-----------|----------------|-------------------------------------------|
| 20004     | 22             | SSH access                                |
| 20005     | 3389           | Remote Desktop Protocol (RDP)             |
| 20020     | 8888           | Jupyter Notebook                          |
| 20022     | 9090           | InvokeAI main service                     |
| 20023     | 7777           | (!) Verify service on this port           |
| 20103     | 1111           | ComfyUI service portal                    |
| 20104     | 8188           | ComfyUI                                   |
| 20105     | 8384           | Syncthing UI                              |
| 20106     | 22999          | Syncthing Transport                       |
| 20107     | 1113           | InvokeAI service portal                   |
| 20110     | 1115           | (!) Verify service on this port           |
| 20119     | 2019           | (!) Verify service on this port           |

> (!) Review the flagged ports to ensure they correspond to the correct services or adjust them as needed.

## SSH Setup

To consistently access services locally through `localhost`, use SSH with local port forwarding:

1. **Ensure local port forwarding** is set up in your SSH configuration.
2. **Example SSH command for port forwarding**:
   ```bash
   ssh -L 9090:localhost:20022 user@your-server-ip
   ```
   - This command forwards your local port `9090` to port `20022` on the remote server, allowing you to access the **InvokeAI** service at `http://localhost:9090` from your local machine.

---

> (!) Make sure that all services are correctly mapped and corresponding container ports are correct in the `docker-compose.yaml` file.

```

### Key Notes:
- Minor changes were made to clarify formatting and structure.
- Added a couple of examples to enhance clarity regarding `.env` file usage and port mapping.
- Flagged several ports with `(!)` for you to verify that they map to the correct services.

Let me know if anything needs further refinement!