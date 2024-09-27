# Matrx IMAgen

Matrx IMAgen is a comprehensive no-code solution designed to streamline AI image generation, making it easier, faster, and more business-oriented. This repository integrates various popular tools in the AI and image generation landscape, including but not limited to **Comfy UI**, **AI Dock**, **Invoke AI**, and many more, brought together in a single platform for ease of use.

Whether you're a business professional looking to generate high-quality images without technical expertise, or a creative wanting a fast and effective workflow, Matrx IMAgen offers a powerful suite of tools to meet your needs.

---

## Key Features

- **No-Code Interface**: Accessible to users of all skill levels—no coding required!
- **Integrated Tools**: Combines the power of various AI image generation frameworks and tools in one place:
  - **Comfy UI**: A flexible UI for various AI models.
  - **AI Dock**: A tool for managing AI workloads and deployments.
  - **Invoke AI**: A versatile AI image generation tool with an intuitive user interface.
  - And many more...
- **Business-Oriented**: Tailored to meet business-specific needs for high-quality, scalable image generation.
- **Customizable Workflows**: Easily select and integrate the best tools for your specific workflow.
- **Fast and Efficient**: Optimized for speed and ease of use.

---

## Installation and Setup

### Prerequisites

- [Git](https://git-scm.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployments)
- Basic hardware to run AI models (GPU recommended for best performance)

### One-Click Install (Recommended)

You can quickly install and set up Matrx IMAgen by following these simple steps:

### Step 1: Clone the Repository

First, you need to clone the Matrx IMAgen repository:

```bash
git clone https://github.com/armanisadeghi/matrx-imagen.git
cd matrx-imagen
```

### Step 2: Configure Environment Variables

Once inside the cloned repository, copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Now, update the following optional environment variables in the `.env` file as needed:

- `CIVITAI_TOKEN` – Add your CivitAI token here.
- `HF_TOKEN` – Add your Hugging Face token here.
- `CF_TUNNEL_TOKEN` – Add your Cloudflare tunnel token here.

If you don't need these tokens, you can leave them blank. 

### Step 3: Run the Deploy Script

After setting up the `.env` file, simply run the deploy script:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will handle everything, including:
- Installing Docker (if not already installed)
- Setting up necessary environments
- Downloading and configuring additional repositories and dependencies
- Installing Python and other required libraries
- Launching Docker containers and running the platform

Once the setup completes, the system will print links to access Matrx IMAgen. Simply follow those links to start using the platform!

---

### Additional Details for Novice Developers

If you're new to working with Git or Linux, here are a few additional tips to help you along the way:

- **Update Your System and Install Git**: If you're working on a fresh system, run these commands first to ensure you have `git` and `curl` installed:
  
  ```bash
  sudo apt update && sudo apt install -y git curl
  ```

- **Ensure Correct Permissions**: Make sure the `deploy.sh` script is executable by running:
  
  ```bash
  chmod +x deploy.sh
  ```

These steps ensure that your system is ready to run the deploy process smoothly.

---

## What Happens During Setup

The `deploy.sh` script will automatically:
- Install Docker Compose (if necessary)
- Create all required environments
- Download and configure various AI tools and repositories
- Set up Python and any dependencies required
- Start the system with everything ready to go

You don’t need to worry about handling Docker, Python environments, or any manual setup—everything is automated!

---

## Usage

Once the setup is complete, follow the links printed by the `deploy.sh` script to start using Matrx IMAgen via your web browser.
- Choose between two different AI Docks: ComfyUI or InvokeAI.
- Check back weekly for updated workflows and tools for ComfyUI and InvokeAI.

### 1. Select the Tools You Need

Matrx IMAgen lets you pick and choose the tools that best suit your needs. For example:
- Use **Comfy UI** for detailed, customizable workflows.
- Use **Invoke AI** for quick, high-quality image generation.
- Use **AI Dock** for managing AI workloads and deployments.
- Use **Jupyter** for interactive coding and data analysis.
- Use **Hugging Face** for accessing a wide range of pre-trained models.
- Use **CivitAI** for finding and sharing high-quality image generation models.

### 2. Business-Driven Workflows

Matrx IMAgen is built with businesses in mind, allowing for scalable image generation workflows that cater to corporate branding, marketing needs, or visual content creation at scale.

### 3. No Code Required

The platform comes with a user-friendly, no-code interface designed for simplicity. All operations can be performed with point-and-click actions, reducing the barrier for non-technical users.

---

## Get Involved

We are constantly working to improve Matrx IMAgen, and we invite developers to contribute to the project. Whether it's fixing bugs, adding new features, or optimizing existing ones, your contributions are welcome!

If you're interested in contributing or have suggestions, please reach out via GitHub issues, pull requests, or [contact us directly](mailto:your-email@example.com).

---

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, feel free to submit an issue or pull request. For major changes, please open an issue to discuss your ideas beforehand.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements

Matrx IMAgen is built on the hard work of the developers behind the following tools:

- [Comfy UI](https://github.com/comfyui)
- [AI Dock](https://github.com/aidock)
- [Invoke AI](https://github.com/invoke-ai)
- And many more open-source projects...

We thank the community for their contributions!
