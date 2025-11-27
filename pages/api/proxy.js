// pages/api/proxy.js
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // OPTIONS 요청 처리
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 프록시할 URL 추출
  const targetUrl = req.query.url || req.body?.url;

  if (!targetUrl) {
    return res.status(400).json({
      error: '사용법: /api/proxy?url=https://example.com',
      example: `${req.headers.host}/api/proxy?url=https://api.github.com/users/github`
    });
  }

  try {
    // 요청 헤더 준비
    const headers = {};
    Object.keys(req.headers).forEach(key => {
      if (!['host', 'connection', 'content-length'].includes(key)) {
        headers[key] = req.headers[key];
      }
    });

    // 타겟 서버로 요청
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' 
        ? JSON.stringify(req.body) 
        : undefined,
    });

    // 응답 데이터 가져오기
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType?.includes('application/json')) {
      data = await response.json();
      return res.status(response.status).json(data);
    } else if (contentType?.includes('text')) {
      data = await response.text();
      res.setHeader('Content-Type', contentType);
      return res.status(response.status).send(data);
    } else {
      data = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType || 'application/octet-stream');
      return res.status(response.status).send(Buffer.from(data));
    }

  } catch (error) {
    return res.status(500).json({
      error: '프록시 요청 실패',
      message: error.message,
      targetUrl: targetUrl
    });
  }
}

// Edge Runtime으로 실행 (더 빠른 성능)
export const config = {
  runtime: 'edge',
};