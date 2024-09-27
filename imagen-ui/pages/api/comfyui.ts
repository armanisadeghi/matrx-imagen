// pages/api/comfyui.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const comfyuiResponse = await fetch(`http://comfyui:${process.env.COMFYUI_PORT_HOST || '8188'}${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const data = await comfyuiResponse.json()
  res.status(comfyuiResponse.status).json(data)
}

// The following code should be in a separate file: pages/api/invokeai.ts
// Remove it from this file and create a new file with this content:
/*
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const invokeaiResponse = await fetch(`http://invokeai:${process.env.INVOKEAI_PORT_HOST}${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const data = await invokeaiResponse.json()
  res.status(invokeaiResponse.status).json(data)
}
*/