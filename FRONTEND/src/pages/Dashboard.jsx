import React, { useState } from 'react';
import UrlForm from '../components/urlForm.jsx';
import UserUrl from '../components/userUrl.jsx';
import { useSelector } from 'react-redux';

// ─── QR Generator ─────────────────────────────────────────────────────────────
const QRGenerator = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [qrSrc, setQrSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!qrUrl.trim()) return;
    setLoading(true);
    setQrSrc(null);
    const encoded = encodeURIComponent(qrUrl.trim());
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}&color=2d3142&bgcolor=fcfaf9`;
    const img = new Image();
    img.onload = () => { setQrSrc(src); setLoading(false); };
    img.onerror = () => setLoading(false);
    img.src = src;
  };

  const handleDownload = () => {
    if (!qrSrc) return;
    const a = document.createElement('a');
    a.href = qrSrc;
    a.download = `qr-${Date.now()}.png`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(qrUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={qrStyles.wrapper}>
      <div style={qrStyles.fieldGroup}>
        <label style={qrStyles.label} htmlFor="dash-qr-url">Enter URL</label>
        <div style={qrStyles.inputWrap}>
          <span style={qrStyles.icon}>🔗</span>
          <input
            id="dash-qr-url"
            type="url"
            placeholder="https://your-url.com"
            value={qrUrl}
            onChange={(e) => { setQrUrl(e.target.value); setQrSrc(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            style={qrStyles.input}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !qrUrl.trim()}
        style={{ ...qrStyles.btn, opacity: loading || !qrUrl.trim() ? 0.6 : 1 }}
      >
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={qrStyles.spinner} /> Generating...
          </span>
        ) : '⬡ Generate QR Code'}
      </button>

      {qrSrc && (
        <div style={qrStyles.result}>
          <div style={qrStyles.qrBox}>
            <img src={qrSrc} alt="QR Code" style={{ width: 180, height: 180, borderRadius: 6, display: 'block' }} />
          </div>
          <p style={{ fontSize: 12, color: '#5f626c', margin: '8px 0 12px', textAlign: 'center' }}>
            Scan with any camera app
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleDownload} style={qrStyles.btn}>↓ Download</button>
            <button
              onClick={handleCopy}
              style={{
                ...qrStyles.outlineBtn,
                color: copied ? '#2e7d5c' : '#2f6690',
                borderColor: copied ? 'rgba(46,125,92,0.4)' : 'rgba(47,102,144,0.25)',
              }}
            >
              {copied ? '✓ Copied!' : '⧉ Copy URL'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const qrStyles = {
  wrapper: { display: 'flex', flexDirection: 'column', gap: 16 },
  fieldGroup: { display: 'flex', flexDirection: 'column' },
  label: {
    fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: '#5f626c', marginBottom: 8, display: 'block',
  },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: 14, fontSize: 14, pointerEvents: 'none', opacity: 0.45 },
  input: {
    width: '100%', background: '#fcfaf9',
    border: '1px solid rgba(45,49,66,0.16)',
    borderRadius: 10, padding: '12px 14px 12px 40px',
    color: '#2d3142', fontSize: 14, fontFamily: "'Outfit', sans-serif",
    transition: 'border-color 0.2s',
  },
  btn: {
    width: '100%', background: '#2f6690',
    border: 'none', borderRadius: 10, color: '#fff',
    fontSize: 14, fontWeight: 600, padding: '12px 20px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'opacity 0.15s',
    flex: 1,
  },
  outlineBtn: {
    flex: 1, background: 'transparent',
    border: '1px solid', borderRadius: 10,
    fontSize: 14, fontWeight: 500, padding: '12px 20px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.2s',
  },
  spinner: {
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff',
    borderRadius: '50%', animation: 'spin 0.6s linear infinite',
  },
  result: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    background: 'rgba(47,102,144,0.04)', border: '1px solid rgba(47,102,144,0.12)',
    borderRadius: 12, padding: '20px 16px', gap: 4,
  },
  qrBox: {
    padding: 12, background: 'rgba(47,102,144,0.06)',
    border: '1px solid rgba(47,102,144,0.15)', borderRadius: 12,
  },
};

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage = () => {
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('shorten');

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fcfaf9; }
        input:focus { outline: none !important; border-color: #2f6690 !important; box-shadow: 0 0 0 3px rgba(47,102,144,0.15) !important; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <main style={styles.main}>

        {/* Welcome strip */}
        <div style={{ ...styles.card, marginBottom: 28, animation: 'fadeUp 0.4s ease both' }}>
          <div style={styles.welcomeInner}>
            <div>
              <h1 style={styles.welcomeTitle}>
                Welcome back, <span style={{ color: '#9d8420' }}>{user?.name?.split(' ')[0] || 'there'}</span> 👋
              </h1>
              <p style={styles.welcomeSub}>Shorten links, generate QR codes, and manage your URLs below.</p>
            </div>
            <div style={styles.pillRow}>
              {[['↗', 'Your Links'], ['✓', 'All Active']].map(([icon, label]) => (
                <div key={label} style={styles.pill}>
                  <span style={{ color: '#2f6690' }}>{icon}</span>
                  <span style={{ fontSize: 13, color: '#5f626c' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main tool card with tabs */}
        <div style={{ ...styles.card, marginBottom: 28, animation: 'fadeUp 0.4s ease 0.05s both' }}>
          {/* Card header */}
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderIcon}>⚡</div>
            <div>
              <h2 style={styles.cardTitle}>URL Tools</h2>
              <p style={styles.cardSub}>Shorten a link or generate a QR code instantly</p>
            </div>
          </div>
          <div style={styles.accentBar} />

          {/* Tab bar */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setActiveTab('shorten')}
              style={{ ...styles.tab, ...(activeTab === 'shorten' ? styles.tabActive : {}) }}
            >
              🔗 Shorten URL
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              style={{ ...styles.tab, ...(activeTab === 'qr' ? styles.tabActive : {}) }}
            >
              ⬡ QR Code
            </button>
          </div>

          {/* Tab content */}
          <div style={styles.cardBody}>
            {activeTab === 'shorten' && <UrlForm />}
            {activeTab === 'qr' && <QRGenerator />}
          </div>
        </div>

        {/* Your links card */}
        <div style={{ ...styles.card, animation: 'fadeUp 0.4s ease 0.1s both' }}>
          <div style={styles.cardHeader}>
            <div style={styles.cardHeaderIcon}>📋</div>
            <div>
              <h2 style={styles.cardTitle}>Your Links</h2>
              <p style={styles.cardSub}>All your shortened URLs with click analytics</p>
            </div>
          </div>
          <div style={styles.accentBar} />
          <div style={styles.cardBody}>
            <UserUrl />
          </div>
        </div>

      </main>

      <footer style={styles.footer}>
        <span style={styles.logoText}>
          ShortUrl<span style={{ color: '#9d8420' }}>4U</span>
        </span>
        <span style={{ color: '#444', fontSize: 12 }}>© 2026 — All rights reserved</span>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', background: '#fcfaf9',
    fontFamily: "'Outfit', sans-serif", color: '#2d3142',
    position: 'relative', overflow: 'hidden',
    display: 'flex', flexDirection: 'column',
  },
  blob1: {
    position: 'fixed', top: -120, right: -120,
    width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(47,102,144,0.1) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },
  blob2: {
    position: 'fixed', bottom: -150, left: -100,
    width: 600, height: 600, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(157,132,32,0.07) 0%, transparent 70%)',
    pointerEvents: 'none', zIndex: 0,
  },

  main: {
    flex: 1, position: 'relative', zIndex: 1,
    padding: '32px 40px 48px',
    maxWidth: 860, margin: '0 auto', width: '100%',
  },

  // Shared card
  card: {
    background: '#ffffff',
    border: '1px solid rgba(45,49,66,0.1)',
    borderRadius: 20, overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },

  // Welcome
  welcomeInner: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexWrap: 'wrap', gap: 16, padding: '24px 28px',
    background: 'rgba(47,102,144,0.05)',
  },
  welcomeTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 'clamp(1.3rem, 3vw, 1.9rem)',
    margin: '0 0 6px', color: '#2d3142',
  },
  welcomeSub: { margin: 0, fontSize: 13, color: '#5f626c' },
  pillRow: { display: 'flex', gap: 10 },
  pill: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: '#ffffff',
    border: '1px solid rgba(45,49,66,0.1)',
    borderRadius: 20, padding: '6px 14px',
  },

  // Card header
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '20px 24px 16px',
  },
  cardHeaderIcon: {
    width: 42, height: 42, borderRadius: 10,
    background: 'rgba(47,102,144,0.1)', border: '1px solid rgba(47,102,144,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, flexShrink: 0,
  },
  cardTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 17, margin: '0 0 3px', color: '#2d3142',
  },
  cardSub: { margin: 0, fontSize: 12, color: '#5f626c' },
  accentBar: { height: 2, background: 'linear-gradient(90deg, #2f6690, transparent)' },

  // Tabs
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(45,49,66,0.1)',
  },
  tab: {
    flex: 1, padding: '14px 8px',
    background: 'transparent', border: 'none',
    borderBottom: '2px solid transparent',
    color: '#5f626c', fontSize: 14, fontWeight: 500,
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#2f6690',
    borderBottom: '2px solid #2f6690',
    background: 'rgba(47,102,144,0.04)',
  },
  cardBody: { padding: '24px' },

  // Footer
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '16px 40px',
    borderTop: '1px solid rgba(45,49,66,0.1)',
  },
  logoText: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 16, color: '#2d3142',
  },
};

export default DashboardPage;