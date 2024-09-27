// pages/api/invokeai.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const invokeaiResponse = await fetch(`http://invokeai:${process.env.INVOKEAI_PORT_HOST || '9090'}${req.url}`, {
    method: req.method,
    headers: req.headers as Record<string, string>,
    body: req.body ? JSON.stringify(req.body) : undefined,
  })

  const data = await invokeaiResponse.json()
  res.status(invokeaiResponse.status).json(data)
}
