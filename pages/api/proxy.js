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
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
      'DNT': '1',
      'Connection': 'keep-alive'
    };

    const response = await fetch(url, {
      headers: headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || 'text/html';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }
    
    if (contentType.includes('image/') || 
        contentType.includes('video/') || 
        contentType.includes('audio/')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(Buffer.from(buffer));
    }
    
    const text = await response.text();
    res.setHeader('Content-Type', contentType);
    return res.status(response.status).send(text);

  } catch (error) {
    return res.status(500).json({ 
      error: error.message,
      url: url 
    });
  }
}
