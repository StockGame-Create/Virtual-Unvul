export default async function handler(req, res) {
  // ⭐ CORS 헤더 추가 (iframe srcDoc에서 리소스 로드 허용)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, *');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL 필요' });
  }

  // ⭐ SSRF 방어
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254'];
    if (blockedHosts.includes(hostname) || hostname.match(/^(10|172\.(1[6-9]|2\d|3[01])|192\.168)\./)) {
      return res.status(403).json({ error: '차단된 URL입니다' });
    }
  } catch (error) {
    return res.status(400).json({ error: '유효하지 않은 URL입니다' });
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Cache-Control': 'max-age=0'
    };

    const response = await fetch(url, {
      headers: headers,
      redirect: 'follow',
      timeout: 15000
    });

    const contentType = response.headers.get('content-type') || 'text/html';

    // ⭐ 응답 헤더 CORS 설정
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // JSON 응답
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.status(response.status).json(data);
    }

    // 바이너리 파일 (이미지, 비디오, 오디오)
    if (contentType.includes('image/') || 
        contentType.includes('video/') || 
        contentType.includes('audio/') ||
        contentType.includes('application/octet-stream')) {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Length', buffer.byteLength);
      return res.status(response.status).end(Buffer.from(buffer));
    }

    // HTML/텍스트 응답
    const text = await response.text();
    res.setHeader('Content-Type', contentType + '; charset=utf-8');
    return res.status(response.status).end(text);

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: error.message,
      url: url 
    });
  }
}
