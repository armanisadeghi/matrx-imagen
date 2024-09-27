# NextJS

## Packages:
 - npx create-next-app@latest nextjs-ui --typescript
 - npm install @supabase/supabase-js @shadcn/ui tailwindcss postcss autoprefixer framer-motion @tanstack/react-query next-auth fabric
 - npx tailwindcss init -p
 - npx tailwindcss init -p
 - npx shadcn-ui@latest init
 

 ## Structure
 matrx-imagen/
├── docker-compose.yml
├── deploy.sh
├── provisioning.sh
├── .env
├── nextjs-ui/
│   ├── Dockerfile
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── ...  # Static files
│   ├── styles/
│   │   └── globals.css
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── profile.tsx
│   │   ├── settings.tsx
│   │   ├── models.tsx
│   │   ├── tools.tsx
│   │   ├── editor.tsx
│   │   ├── utilities.tsx
│   │   ├── workflows.tsx
│   │   ├── links.tsx
│   │   ├── gallery.tsx
│   │   ├── image-action.tsx
│   │   ├── generate.tsx
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth].ts
│   │       ├── comfyui.ts
│   │       └── invokeai.ts
│   ├── components/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ModelCard.tsx
│   │   ├── ToolCard.tsx
│   │   ├── ImageEditor.tsx
│   │   ├── WorkflowCard.tsx
│   │   ├── GalleryGrid.tsx
│   │   └── ImageActionForm.tsx
│   ├── lib/
│   │   ├── supabaseClient.ts
│   │   └── api.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useWorkflows.ts
│   └── types/
│       └── index.ts
├── build/
│   └── ...  # 
├── config/
│   └── ...  # 
├── workspace/
│   └── ...  # 
├── extras/
│   └── ...  # 
├── resources/
│   └── ...  # 
├── utils/
│   └── ...  # 
├── workflows/
│   └── ...  # 
├── comfyui/
│   └── ...  # ComfyUI files
└── invokeai/
    └── ...  # InvokeAI files
