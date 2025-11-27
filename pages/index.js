import { useState } from 'react';
import { Search, Loader, AlertCircle, CheckCircle, Code } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('preview');

  const exampleUrls = [
    'https://jsonplaceholder.typicode.com/posts/1',
    'https://api.github.com/users/github',
    'https://dog.ceo/api/breeds/image/random',
    'https://httpbin.org/json'
  ];

  const testProxy = async () => {
    if (!url) {
      setError('URL을 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch(`/api/proxy?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        const data = await response.json();
        setResult(JSON.stringify(data, null, 2));
      } else {
        const text = await response.text();
        setResult(text);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      testProxy();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white',
          marginBottom: '50px',
          paddingTop: '40px'
        }}>
          <h1 style={{
            fontSize: '56px',
            fontWeight: '800',
            margin: '0 0 15px 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            🛡️ Virtual-Unvul
          </h1>
          <p style={{
            fontSize: '20px',
            opacity: 0.95,
            margin: 0
          }}>
            안전한 웹 프록시로 모든 웹사이트에 접근하세요
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          marginBottom: '30px'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#333',
              marginBottom: '10px'
            }}>
              프록시할 URL 입력
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 16px',
                  fontSize: '16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  outline: 'none',
                  transition: 'border 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.border = '2px solid #667eea'}
                onBlur={(e) => e.target.style.border = '2px solid #e0e0e0'}
              />
              <div style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>
                <Search size={20} color="#999" />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <p style={{
              fontSize: '13px',
              color: '#666',
              marginBottom: '10px'
            }}>
              빠른 테스트:
            </p>
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              {exampleUrls.map((exUrl, i) => (
                <button
                  key={i}
                  onClick={() => setUrl(exUrl)}
                  style={{
                    padding: '8px 16px',
                    background: '#f5f5f5',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: '#555',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#667eea';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f5f5f5';
                    e.target.style.color = '#555';
                  }}
                >
                  {exUrl.split('/')[2]}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={testProxy}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
            }}
          >
            {loading ? (
              <>
                <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                로딩 중...
              </>
            ) : (
              <>
                <Search size={20} />
                프록시 요청 보내기
              </>
            )}
          </button>

          {error && (
            <div style={{
              marginTop: '20px',
              padding: '16px',
              background: '#fee',
              border: '2px solid #fcc',
              borderRadius: '12px',
              color: '#c33',
              display: 'flex',
              alignItems: 'start',
              gap: '10px'
            }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>오류 발생</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{error}</p>
              </div>
            </div>
          )}

          {result && !error && (
            <div style={{ marginTop: '30px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#10b981',
                  fontWeight: '600'
                }}>
                  <CheckCircle size={20} />
                  성공적으로 로드됨
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setViewMode('preview')}
                    style={{
                      padding: '8px 16px',
                      background: viewMode === 'preview' ? '#667eea' : '#f5f5f5',
                      color: viewMode === 'preview' ? 'white' : '#555',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    미리보기
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    style={{
                      padding: '8px 16px',
                      background: viewMode === 'code' ? '#667eea' : '#f5f5f5',
                      color: viewMode === 'code' ? 'white' : '#555',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Code size={14} />
                    코드
                  </button>
                </div>
              </div>

              {viewMode === 'preview' ? (
                <iframe
                  srcDoc={result}
                  style={{
                    width: '100%',
                    height: '600px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '12px',
                    background: 'white'
                  }}
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <pre style={{
                  padding: '20px',
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  borderRadius: '12px',
                  overflow: 'auto',
                  maxHeight: '600px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  margin: 0
                }}>
                  {result}
                </pre>
              )}
            </div>
          )}
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '20px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}>
          <h3 style={{
            margin: '0 0 20px 0',
            fontSize: '24px',
            color: '#333'
          }}>
            🔌 API 사용 방법
          </h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            다른 웹사이트나 앱에서 Virtual-Unvul 프록시를 사용하세요:
          </p>
          <pre style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '20px',
            borderRadius: '12px',
            overflow: 'auto',
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
{`// JavaScript 예시
const response = await fetch(
  '/api/proxy?url=' + encodeURIComponent('https://example.com')
);
const data = await response.text();

// Axios 예시
const { data } = await axios.get('/api/proxy', {
  params: { url: 'https://example.com' }
});`}
          </pre>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
