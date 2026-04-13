const crypto = require('crypto');

export default async function handler(req, res) {
  // CORS — solo permite peticiones desde el sitio del municipio
  res.setHeader('Access-Control-Allow-Origin', 'https://jvelez-cyber.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  const { publicId, resourceType = 'image' } = req.body;
  if (!publicId) return res.status(400).json({ error: 'publicId requerido' });

  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return res.status(500).json({ error: 'Variables de entorno de Cloudinary no configuradas' });
  }

  // Firma requerida por Cloudinary
  const timestamp = Math.round(Date.now() / 1000);
  const signature = crypto
    .createHash('sha1')
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest('hex');

  const body = new URLSearchParams();
  body.append('public_id', publicId);
  body.append('timestamp', String(timestamp));
  body.append('api_key', apiKey);
  body.append('signature', signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,
    { method: 'POST', body }
  );

  const result = await response.json();
  return res.status(200).json(result);
}
