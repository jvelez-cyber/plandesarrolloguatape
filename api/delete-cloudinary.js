const crypto = require('crypto');

module.exports = async function handler(req, res) {
  // CORS — solo permite peticiones desde el sitio del municipio
  res.setHeader('Access-Control-Allow-Origin', 'https://jvelez-cyber.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight OPTIONS
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido' });

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

  const https = require('https');

  const postData = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature: signature
  }).toString();

  const result = await new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.cloudinary.com',
      path: `/v1_1/${cloudName}/${resourceType}/destroy`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => { data += chunk; });
      response.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { resolve({ result: 'ok' }); }
      });
    });

    request.on('error', reject);
    request.write(postData);
    request.end();
  });

  return res.status(200).json(result);
};
