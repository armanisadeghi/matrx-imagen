import os
import sys
import subprocess
import requests
import zipfile
import git
from dotenv import load_dotenv
from tqdm import tqdm

# Load environment variables
load_dotenv()

# Configuration
WORKSPACE = os.getenv('WORKSPACE', '/workspace')
COMFYUI_DIR = f"{WORKSPACE}/ComfyUI"
STORAGE_DIR = f"{WORKSPACE}/storage/stable_diffusion/models"
VENV_PATH = os.getenv("COMFYUI_VENV", "/opt/venv/comfyui")
VENV_PIP = f"{VENV_PATH}/bin/pip"

# Color codes for print messages
BLUE = '\033[1;34m'
GREEN = '\033[1;32m'
YELLOW = '\033[1;33m'
RED = '\033[1;31m'
RESET = '\033[0m'

def print_color(message, color):
    print(f"{color}{message}{RESET}")

def run_command(command):
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
    output, error = process.communicate()
    if process.returncode != 0:
        print_color(f"Error executing command: {command}", RED)
        print_color(error.decode(), RED)
    return output.decode()

def parse_env_urls(variable_name):
    urls_string = os.getenv(variable_name, "")
    return [url.strip() for url in urls_string.split("\n") if url.strip()]

def download_file(url, directory, filename=None):
    os.makedirs(directory, exist_ok=True)
    local_filename = filename or url.split('/')[-1]
    filepath = os.path.join(directory, local_filename)
    
    if os.path.exists(filepath):
        print_color(f"{local_filename} already exists, skipping.", YELLOW)
        return
    
    headers = {}
    if 'civitai.com' in url:
        token = os.getenv('CIVITAI_TOKEN')
        if token:
            url += f"{'&' if '?' in url else '?'}token={token}"
    elif 'huggingface.co' in url:
        token = os.getenv('HF_TOKEN')
        if token:
            headers['Authorization'] = f'Bearer {token}'
    
    try:
        with requests.get(url, stream=True, headers=headers) as r:
            r.raise_for_status()
            total_size = int(r.headers.get('content-length', 0))
            block_size = 1024
            with open(filepath, 'wb') as f, tqdm(
                desc=local_filename,
                total=total_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as progress_bar:
                for data in r.iter_content(block_size):
                    size = f.write(data)
                    progress_bar.update(size)
        print_color(f"Downloaded: {local_filename}", GREEN)
        
        if zipfile.is_zipfile(filepath):
            with zipfile.ZipFile(filepath, 'r') as zip_ref:
                zip_ref.extractall(os.path.splitext(filepath)[0])
            print_color(f"Extracted: {local_filename}", GREEN)
    except Exception as e:
        print_color(f"Error downloading {url}: {str(e)}", RED)

def clone_or_update_repo(repo_url, target_dir):
    dir_name = repo_url.split('/')[-1].replace(".git", "")
    full_path = os.path.join(target_dir, dir_name)
    
    try:
        if os.path.exists(full_path):
            if os.getenv("AUTO_UPDATE", "false").lower() != "false":
                print_color(f"Updating repository: {dir_name}", BLUE)
                repo = git.Repo(full_path)
                repo.remotes.origin.pull()
        else:
            print_color(f"Cloning repository: {repo_url}", BLUE)
            git.Repo.clone_from(repo_url, full_path)
        
        requirements_file = os.path.join(full_path, "requirements.txt")
        if os.path.exists(requirements_file):
            print_color(f"Installing requirements for {dir_name}...", BLUE)
            run_command(f"{VENV_PIP} install --no-cache-dir -r {requirements_file}")
    except Exception as e:
        print_color(f"Error processing repository {repo_url}: {str(e)}", RED)

def setup_dependencies():
    print_color("Installing dependencies...", BLUE)
    dependencies = [
        "opencv-python", "insightface", "rembg", "numba", "scikit-image", "ultralytics",
        "safetensors", "einops", "transformers", "scipy", "torchsde", "aiohttp", "spandrel",
        "kornia", "vispy", "matplotlib", "timm", "imageio_ffmpeg", "filetype", "pykalman",
        "slugify", "xformers", "huggingface_hub", "diffusers", "accelerate", "onediff",
        "onediffx", "nexfort"
    ]
    run_command(f"{VENV_PIP} install {' '.join(dependencies)} -U --no-cache-dir")

def setup_repositories():
    print_color("Setting up repositories...", BLUE)
    if not os.path.exists(COMFYUI_DIR):
        run_command(f"git clone -q --depth 1 https://github.com/comfyanonymous/ComfyUI {COMFYUI_DIR}")
    os.chdir(COMFYUI_DIR)
    run_command("git reset --hard")
    run_command("git pull")
    
    custom_nodes = parse_env_urls("CUSTOM_NODE_URLS")
    for repo_url in custom_nodes:
        clone_or_update_repo(repo_url, f"{COMFYUI_DIR}/custom_nodes")

def download_models(model_type, env_var_name):
    model_dir = os.path.join(STORAGE_DIR, model_type)
    model_urls = parse_env_urls(env_var_name)
    for url in model_urls:
        download_file(url, model_dir)

def setup_comfyui():
    print_color("Setting up ComfyUI...", BLUE)
    podid = os.environ.get('RUNPOD_POD_ID')
    if podid:
        localurl = f"https://{podid}-3000.proxy.runpod.net"
        run_command(f"sed -i 's@logging.info(\"To see the GUI go to: {{}}://{{}}:{{}}\".format(scheme, address, port))@print(\"[32m\u2714 Connected\")\\n            print(\"[1;34m{localurl}[0m\")@' {COMFYUI_DIR}/server.py")

def main():
    print_color("Starting ComfyUI setup...", BLUE)
    
    setup_dependencies()
    setup_repositories()
    
    download_models("checkpoints", "MODEL_URLS_CKPT")
    download_models("lora", "MODEL_URLS_LORA")
    download_models("vae", "MODEL_URLS_VAE")
    download_models("controlnet", "MODEL_URLS_CONTROLNET")
    download_models("upscale_models", "MODEL_URLS_ESRGAN")
    download_models("unet", "MODEL_URLS_UNET")
    download_models("inpaint", "MODEL_URLS_INPAINT")
    
    setup_comfyui()
    
    print_color("Running ComfyUI quick test...", BLUE)
    run_command(f"""
    cd {COMFYUI_DIR} &&
    source {VENV_PATH}/bin/activate &&
    LD_PRELOAD=libtcmalloc.so python main.py \
        --cpu \
        --listen 127.0.0.1 \
        --port 11404 \
        --disable-auto-launch \
        --quick-test-for-ci &&
    deactivate
    """)
    
    print_color("ComfyUI setup completed successfully!", GREEN)

if __name__ == "__main__":
    main()