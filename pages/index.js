// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testProxy = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Virtual Unvul</h1>
      <p>CORS 제한 없이 모든 API에 접근하세요!</p>
      
      <div style={{ marginTop: '30px' }}>
        <input
          type="text"
          placeholder="https://api.example.com/data"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px', 
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px'
          }}
        />
        <button
          onClick={testProxy}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '12px 24px',
            fontSize: '16px',
            background: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {loading ? '로딩 중...' : '테스트'}
        </button>
      </div>

      {result && (
        <pre style={{
          marginTop: '20px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '8px',
          overflow: 'auto'
        }}>
          {result}
        </pre>
      )}

      <div style={{ marginTop: '40px' }}>
        <h3>사용 예시:</h3>
        <code style={{ background: '#f5f5f5', padding: '4px 8px', borderRadius: '4px' }}>
          https://your-proxy.vercel.app/api/proxy?url=https://api.github.com/users/github
        </code>
      </div>
    </div>
  );

}
