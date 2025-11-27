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
      const text = await response.text();
      setResult(text);
    } catch (error) {
      setResult('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>🚀 Web Proxy</h1>
      
      <input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '12px', fontSize: '16px' }}
      />
      <button onClick={testProxy} disabled={loading} style={{ marginTop: '10px', padding: '12px 24px' }}>
        {loading ? '로딩 중...' : '테스트'}
      </button>

      {result && (
        <iframe
          srcDoc={result}
          style={{
            width: '100%',
            height: '600px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            marginTop: '20px'
          }}
        />
      )}
    </div>
  );
}
