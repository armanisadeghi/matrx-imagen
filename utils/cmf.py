import os
import shutil
from IPython.display import clear_output
from subprocess import call

def deps():
    if not os.path.exists('/usr/local/lib/python3.10/dist-packages/safetensors'):
        print('[1;33mInstalling the dependencies...')
        call('pip install opencv-python insightface rembg numba scikit-image ultralytics safetensors einops transformers scipy torchsde aiohttp spandrel kornia vispy matplotlib timm imageio_ffmpeg filetype pykalman slugify xformers huggingface_hub -qq', shell=True)
        call('pip install -U diffusers accelerate', shell=True)
        call('pip install --pre onediff onediffx', shell=True)
        call('pip install nexfort', shell=True)

def repo():
    os.chdir('/workspace')
    print('[1;33mInstalling/Updating the repo...')
    if not os.path.exists('/workspace/ComfyUI'):
        call('git clone -q --depth 1 https://github.com/comfyanonymous/ComfyUI', shell=True)
    os.chdir('ComfyUI')
    call('git reset --hard', shell=True)
    print('[1;32m')
    call('git pull', shell=True)
    
    os.chdir('/workspace')

    def clone_and_install_requirements(repo_url):
        repo_name = repo_url.split('/')[-1]
        target_dir = f'/workspace/ComfyUI/custom_nodes/{repo_name}'
        if not os.path.exists(target_dir):
            call(f'git clone {repo_url} {target_dir}', shell=True)
            requirements_file = os.path.join(target_dir, 'requirements.txt')
            if os.path.exists(requirements_file):
                print(f'Installing requirements for {repo_name}...')
                call(f'pip install -r {requirements_file}', shell=True)

    repos = [
        'https://github.com/ltdrdata/ComfyUI-Manager',
        'https://github.com/Fannovel16/ComfyUI-Frame-Interpolation',
        'https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite',
        'https://github.com/kijai/ComfyUI-CogVideoXWrapper',
        'https://github.com/ltdrdata/ComfyUI-Impact-Pack',
        'https://github.com/Fannovel16/comfyui_controlnet_aux',
        'https://github.com/cubiq/ComfyUI_IPAdapter_plus',
        'https://github.com/yolain/ComfyUI-Easy-Use',
        'https://github.com/chflame163/ComfyUI_LayerStyle',
        'https://github.com/cubiq/ComfyUI_essentials',
        'https://github.com/Suzie1/ComfyUI_Comfyroll_CustomNodes',
        'https://github.com/FizzleDorf/ComfyUI_FizzNodes',
        'https://github.com/lquesada/ComfyUI-Inpaint-CropAndStitch',
        'https://github.com/nullquant/ComfyUI-BrushNet',
        'https://github.com/Acly/comfyui-inpaint-nodes',
        'https://github.com/PowerHouseMan/ComfyUI-AdvancedLivePortrait',
        'https://github.com/cubiq/ComfyUI_InstantID',
        'https://github.com/cubiq/ComfyUI_FaceAnalysis',
        'https://github.com/comfyanonymous/ComfyUI_bitsandbytes_NF4',
        'https://github.com/ssitu/ComfyUI_UltimateSDUpscale',
        'https://github.com/kijai/ComfyUI-KJNodes',
        'https://github.com/pythongosssss/ComfyUI-Custom-Scripts',
        'https://github.com/crystian/ComfyUI-Crystools',
        'https://github.com/rgthree/rgthree-comfy',
        'https://github.com/city96/ComfyUI-GGUF',
        'https://github.com/ltdrdata/ComfyUI-Inspire-Pack'
    ]

    for repo_url in repos:
        clone_and_install_requirements(repo_url)

    call('pwd', shell=True)

def sd():
    podid = os.environ.get('RUNPOD_POD_ID')
    localurl = f"https://{podid}-3000.proxy.runpod.net"
    call("sed -i 's@logging.info(\"To see the GUI go to: {}://{}:{}\".format(scheme, address, port))@print(\"[32m\u2714 Connected\")\\n            print(\"[1;34m"+localurl+"[0m\")@' /workspace/ComfyUI/server.py", shell=True)
    os.chdir('/workspace')

import os
import requests
from tqdm import tqdm
import zipfile
from subprocess import call


def download_files(models, directory):
    os.makedirs(directory, exist_ok=True)
    for model in models:
        url, filename = model if isinstance(model, tuple) else (model, model.split('/')[-1])
        output_path = os.path.join(directory, filename)
        if not os.path.exists(output_path):
            print(f'Downloading {filename}...')
            if 'civitai.com' in url:
                token = "15d6a1139a7fa72014a35b98897eeb01"
                url += f"{'&' if '?' in url else '?'}token={token}"
            call(f'wget -q {url} -O {output_path}', shell=True)
            print(f'Downloaded {filename}')
            if zipfile.is_zipfile(output_path):
                with zipfile.ZipFile(output_path, 'r') as zip_ref:
                    zip_ref.extractall(os.path.splitext(output_path)[0])
        else:
            print(f'{filename} already exists, skipping.')

def download_models():
    models = [
        'https://civitai.com/api/download/models/456538?type=Model&format=SafeTensor&size=pruned&fp=fp16',
        'https://civitai.com/api/download/models/245598?type=Model&format=SafeTensor&size=full&fp=fp16',
        'https://huggingface.co/SG161222/RealVisXL_V5.0/resolve/main/RealVisXL_V5.0_fp16.safetensors',
        'https://huggingface.co/SG161222/RealVisXL_V5.0_Lightning/resolve/main/RealVisXL_V5.0_Lightning_fp16.safetensors',
        'https://huggingface.co/Comfy-Org/flux1-dev/resolve/main/flux1-dev-fp8.safetensors',
    ]
    download_files(models, '/workspace/ComfyUI/models/checkpoints/')

def download_upscalers():
    models = [
        'https://huggingface.co/Kim2091/UltraSharp/resolve/main/4x-UltraSharp.pth',
        'https://huggingface.co/ai-forever/Real-ESRGAN/resolve/main/RealESRGAN_x2.pth',
    ]
    download_files(models, '/workspace/ComfyUI/models/upscale_models/')

def download_controlnet():
    models = [
        ('https://huggingface.co/xinsir/controlnet-tile-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors', 'SDXL_xinsir_depth.safetensors'),
        ('https://huggingface.co/Shakker-Labs/FLUX.1-dev-ControlNet-Depth/resolve/main/diffusion_pytorch_model.safetensors', 'Flux_ShakkerLabs_depth.safetensors'),
        ('https://huggingface.co/xinsir/controlnet-openpose-sdxl-1.0/resolve/main/diffusion_pytorch_model.safetensors', 'SDXL_xinsir_pose.safetensors')
    ]
    download_files(models, '/workspace/ComfyUI/models/controlnet/')

def download_inpaint():
    models = [
        'https://huggingface.co/lllyasviel/fooocus_inpaint/resolve/main/fooocus_inpaint_head.pth',
        'https://huggingface.co/lllyasviel/fooocus_inpaint/resolve/main/inpaint_v26.fooocus.patch',
    ]
    download_files(models, '/workspace/ComfyUI/models/inpaint/')

def copy_notebook():
    # Define source and destination paths
    source_notebook = 'utils/ComfyUI.ipynb'
    destination_directory = '/workspace/ComfyUI/notebooks'
    destination_notebook = os.path.join(destination_directory, 'ComfyUI.ipynb')
    
    # Create the notebooks directory if it doesn't exist
    os.makedirs(destination_directory, exist_ok=True)
    
    # Copy the notebook
    if os.path.exists(source_notebook):
        shutil.copy(source_notebook, destination_notebook)
        print(f"Copied {source_notebook} to {destination_notebook}")
    else:
        print(f"Notebook {source_notebook} not found!")


if __name__ == "__main__":
    deps()
    repo()
    download_models()
    download_upscalers()
    download_inpaint()
    download_controlnet()
    sd()
    copy_notebook()