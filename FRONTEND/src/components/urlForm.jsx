// import React, { useState } from 'react'
// import { createShortUrl, generateQRCode } from '../api/shortUrl.api'
// import { useSelector } from 'react-redux'
// import { useQueryClient } from '@tanstack/react-query'
// import { queryClient } from '../main'

// const UrlForm = () => {
//   const queryClientInstance = useQueryClient()
//   const [url, setUrl] = useState("https://your-url.com")
//   const [shortUrl, setShortUrl] = useState(null)
//   const [qrCode, setQrCode] = useState(null)
//   const [copied, setCopied] = useState(false)
//   const [error, setError] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [customUrl, setCustomUrl] = useState("")
//   const {isAuthenticated} = useSelector((state) => state.auth)

//   const handleSubmit = async () => {
//     try{
//       setLoading(true)
//       const shortUrl = await createShortUrl(url,customUrl)
//       setShortUrl(shortUrl)
      
//       // Generate QR code for the short URL
//       try {
//         const qr = await generateQRCode(shortUrl)
//         setQrCode(qr)
//       } catch (qrErr) {
//         console.error('QR generation failed:', qrErr)
//         setQrCode(null)
//       }
      
//       queryClientInstance.invalidateQueries({queryKey: ['userUrls']})
//       setError(null)
//       setLoading(false)
//     }catch(err){
//       setError(err.message)
//       setLoading(false)
//     }
//   }
//   const handleCopy = () => {
//     navigator.clipboard.writeText(shortUrl);
//     setCopied(true);
    
//     // Reset the copied state after 2 seconds
//     setTimeout(() => {
//       setCopied(false);
//     }, 2000);
//   }

//   const downloadQR = () => {
//     if (!qrCode) return
    
//     const link = document.createElement('a')
//     link.href = qrCode
//     link.download = `qr-${Date.now()}.png`
//     link.click()
//   }

//   return (
//     <div  className="space-y-4">
//         <div>
//           <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
//             Enter your URL
//           </label>
//           <input
//             type="url"
//             id="url"
//             value={url}
//             onInput={(event)=>setUrl(event.target.value)}
//             placeholder="https://example.com"
//             required
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <button
//           onClick={handleSubmit}
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//         >{loading ? 'Creating...' : 'Shorten URL'}
//         </button>
//          {error && (
//           <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
//             {error}
//           </div>
//         )}
//         {isAuthenticated && (
//           <div className="mt-4">
//             <label htmlFor="customUrl" className="block text-sm font-medium text-gray-700 mb-1">
//               Custom URL (optional)
//             </label>
//             <input
//               type="text"
//               id="customUrl"
//               value={customUrl}
//               onChange={(event) => setCustomUrl(event.target.value)}
//               placeholder="Enter custom Url"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//         )}
//         {shortUrl && (
//           <div className="mt-6 space-y-4">
//             <div>
//               <h2 className="text-lg font-semibold mb-2">Your shortened URL:</h2>
//               <div className="flex items-center">
//                 <input
//                   type="text"
//                   readOnly
//                   value={shortUrl}
//                   className="flex-1 p-2 border border-gray-300 rounded-l-md bg-gray-50"
//                 />
//                 <button
//                   onClick={handleCopy}
//                   className={`px-4 py-2 rounded-r-md transition-colors duration-200 ${
//                     copied 
//                       ? 'bg-green-500 text-white hover:bg-green-600' 
//                       : 'bg-gray-200 hover:bg-gray-300'
//                   }`}
//                 >
//                   {copied ? 'Copied!' : 'Copy'}
//                 </button>
//               </div>
//             </div>
            
//             {qrCode && (
//               <div className="mt-6 p-4 border border-gray-300 rounded-md bg-gray-50 text-center">
//                 <h3 className="text-lg font-semibold mb-3">QR Code</h3>
//                 <img 
//                   src={qrCode} 
//                   alt="QR Code" 
//                   className="w-48 h-48 mx-auto border-2 border-gray-300 rounded-md p-2 bg-white"
//                 />
//                 <button
//                   onClick={downloadQR}
//                   className="mt-3 w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
//                 >
//                   Download QR Code
//                 </button>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//   )
// }

// export default UrlForm

import React, { useState } from 'react';
import { createShortUrl, generateQRCode } from '../api/shortUrl.api';
import { useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';

const UrlForm = () => {
  const queryClientInstance = useQueryClient();
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!url.trim()) return;
    setError(null);
    setShortUrl(null);
    setQrCode(null);
    setShowQR(false);
    setLoading(true);

    try {
      const result = await createShortUrl(url, customUrl);
      setShortUrl(result);
      queryClientInstance.invalidateQueries({ queryKey: ['userUrls'] });

      // Try to generate QR silently
      try {
        const qr = await generateQRCode(result);
        setQrCode(qr);
      } catch (_) {
        setQrCode(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to shorten URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (!qrCode) return;
    const a = document.createElement('a');
    a.href = qrCode;
    a.download = `qr-${Date.now()}.png`;
    a.click();
  };

  return (
    <div style={styles.wrapper}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* URL Input */}
      <div style={styles.fieldGroup}>
        <label style={styles.label} htmlFor="url-input">Long URL</label>
        <div style={styles.inputWrap}>
          <span style={styles.inputIcon}>🔗</span>
          <input
            id="url-input"
            type="url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
            placeholder="https://your-very-long-url.com"
            required
            autoComplete="url"
            style={styles.input}
          />
        </div>
      </div>

      {/* Custom URL (auth only) */}
      {isAuthenticated && (
        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor="custom-url">
            Custom Alias <span style={{ color: '#555', fontWeight: 400 }}>(optional)</span>
          </label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>✏</span>
            <input
              id="custom-url"
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="my-custom-link"
              style={styles.input}
            />
          </div>
          {customUrl && (
            <span style={styles.previewText}>
              Preview: <span style={{ color: '#2f6690' }}>localhost:3000/{customUrl}</span>
            </span>
          )}
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !url.trim()}
        style={{ ...styles.submitBtn, opacity: loading || !url.trim() ? 0.6 : 1 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={styles.spinner} /> Shortening...
          </span>
        ) : (
          '⚡ Shorten URL'
        )}
      </button>

      {/* Error */}
      {error && (
        <div style={styles.errorBox}>
          <span>⚠</span> {error}
        </div>
      )}

      {/* Result */}
      {shortUrl && (
        <div style={{ animation: 'fadeUp 0.4s ease both' }}>
          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <span style={styles.dividerText}>Your short link</span>
            <div style={styles.dividerLine} />
          </div>

          {/* Short URL row */}
          <div style={styles.resultBox}>
            <div style={styles.resultUrlWrap}>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.resultUrl}
              >
                {shortUrl}
              </a>
            </div>
            <button
              onClick={handleCopy}
              style={{
                ...styles.copyBtn,
                background: copied ? 'rgba(46,125,92,0.14)' : 'rgba(47,102,144,0.1)',
                borderColor: copied ? 'rgba(46,125,92,0.4)' : 'rgba(47,102,144,0.25)',
                color: copied ? '#2e7d5c' : '#2f6690',
              }}
            >
              {copied ? '✓ Copied!' : '⧉ Copy'}
            </button>
          </div>

          {/* QR toggle */}
          {qrCode && (
            <button
              onClick={() => setShowQR((v) => !v)}
              style={styles.qrToggleBtn}
            >
              {showQR ? '▲ Hide QR Code' : '⬡ Show QR Code'}
            </button>
          )}

          {/* QR Code panel */}
          {qrCode && showQR && (
            <div style={{ ...styles.qrPanel, animation: 'fadeUp 0.3s ease both' }}>
              <img src={qrCode} alt="QR Code" style={styles.qrImage} />
              <p style={styles.qrSub}>Scan with any camera app</p>
              <button onClick={downloadQR} style={styles.downloadBtn}>
                ↓ Download QR Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex', flexDirection: 'column', gap: 16,
    fontFamily: "'Outfit', sans-serif",
  },

  fieldGroup: { display: 'flex', flexDirection: 'column', gap: 0 },
  label: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#666', marginBottom: 8, display: 'block',
  },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: {
    position: 'absolute', left: 14, fontSize: 14,
    pointerEvents: 'none', opacity: 0.45,
  },
  input: {
    width: '100%', background: '#fcfaf9',
    border: '1px solid rgba(45,49,66,0.16)',
    borderRadius: 10, padding: '12px 14px 12px 40px',
    color: '#2d3142', fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  previewText: { fontSize: 11, color: '#555', marginTop: 6 },

  submitBtn: {
    width: '100%',
    background: '#2f6690',
    border: 'none', borderRadius: 10,
    color: '#fff', fontSize: 15, fontWeight: 600,
    padding: '13px 20px', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    transition: 'opacity 0.15s',
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff', borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },

  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(157,132,32,0.1)', border: '1px solid rgba(157,132,32,0.3)',
    borderRadius: 8, padding: '10px 14px',
    color: '#806b16', fontSize: 13,
  },

  divider: { display: 'flex', alignItems: 'center', gap: 10, margin: '4px 0 12px' },
  dividerLine: { flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' },
  dividerText: { fontSize: 11, color: '#444', whiteSpace: 'nowrap', letterSpacing: '0.08em' },

  resultBox: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(47,102,144,0.06)', border: '1px solid rgba(47,102,144,0.16)',
    borderRadius: 10, padding: '12px 14px',
  },
  resultUrlWrap: { flex: 1, overflow: 'hidden' },
  resultUrl: {
    color: '#2f6690', fontSize: 14, fontWeight: 500,
    textDecoration: 'none', display: 'block',
    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
  },
  copyBtn: {
    border: '1px solid', borderRadius: 8,
    fontSize: 12, fontWeight: 500, padding: '7px 14px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0,
  },

  qrToggleBtn: {
    width: '100%', marginTop: 10,
    background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8, color: '#666', fontSize: 13, fontWeight: 500,
    padding: '9px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    transition: 'color 0.2s, border-color 0.2s',
  },
  qrPanel: {
    marginTop: 12, textAlign: 'center',
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: 12, padding: '20px 16px',
  },
  qrImage: {
    width: 160, height: 160, display: 'block', margin: '0 auto',
    borderRadius: 8, border: '1px solid rgba(47,102,144,0.2)',
  },
  qrSub: { fontSize: 12, color: '#555', margin: '8px 0 12px' },
  downloadBtn: {
    width: '100%', background: 'transparent',
    border: '1px solid rgba(157,132,32,0.45)',
    borderRadius: 8, color: '#806b16',
    fontSize: 13, fontWeight: 500, padding: '9px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
  },
};

export default UrlForm;