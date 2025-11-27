export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL 필요' });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get('content-type') || 'text/plain';
    
    // JSON이면 JSON으로, 아니면 텍스트로
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    } else {
      const data = await response.text();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(data);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
