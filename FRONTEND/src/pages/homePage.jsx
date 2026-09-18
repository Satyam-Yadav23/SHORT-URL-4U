import React, { useState } from 'react';
import UrlForm from '../components/urlForm.jsx';

// QR Code generator using free API (no install needed)
const QRGenerator = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [qrImage, setQrImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!qrUrl.trim()) return;
    setLoading(true);
    // Using QR Server API (free, no key needed)
    const encoded = encodeURIComponent(qrUrl);
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}&color=2d3142&bgcolor=fcfaf9`;
    setQrImage(src);
    setGenerated(true);
    setLoading(false);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = qrImage;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={styles.label}>Enter URL for QR Code</label>
        <input
          type="url"
          value={qrUrl}
          onChange={(e) => { setQrUrl(e.target.value); setGenerated(false); }}
          placeholder="https://your-url.com"
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading || !qrUrl.trim()}
        style={{ ...styles.primaryBtn, opacity: !qrUrl.trim() ? 0.5 : 1 }}
      >
        {loading ? 'Generating...' : '⬡ Generate QR Code'}
      </button>

      {generated && qrImage && (
        <div style={styles.qrResult}>
          <img src={qrImage} alt="QR Code" style={{ width: 160, height: 160, display: 'block', margin: '0 auto' }} />
          <p style={{ textAlign: 'center', fontSize: 12, color: '#5f626c', marginTop: 8 }}>
            Scan with any camera app
          </p>
          <button onClick={handleDownload} style={styles.outlineBtn}>
            ↓ Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('shorten');

  return (
    <div style={styles.page}>
      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Outfit:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #fcfaf9; }
        input:focus { outline: none; border-color: #2f6690 !important; box-shadow: 0 0 0 3px rgba(47,102,144,0.14); }
        @media (max-width: 700px) {
          .home-hero { padding: 56px 20px 72px !important; gap: 42px !important; }
          .home-hero-card { min-width: 0 !important; }
          .home-features { padding: 0 20px 64px !important; grid-template-columns: 1fr !important; }
          .home-footer { padding: 20px !important; gap: 12px; flex-wrap: wrap; }
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:1; } }
      `}</style>

      {/* Hero */}
      <div className="home-hero" style={styles.hero}>
        <div style={styles.heroLeft}>
          <div style={styles.badge}>🔗 Free URL Shortener</div>
          <h1 style={styles.heroTitle}>
            Shrink Links.<br />
            <span style={{ color: '#9d8420' }}>Grow Reach.</span>
          </h1>
          <p style={styles.heroSub}>
            Create short, powerful links and QR codes in seconds.
            Track clicks, share anywhere — no sign-up required.
          </p>
          <div style={styles.statsRow}>
            {[['1000+', 'Links Created'], ['99.9%', 'Uptime'], ['Free', 'Forever']].map(([val, label]) => (
              <div key={label} style={styles.stat}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="home-hero-card" style={styles.card}>
          {/* Tab bar */}
          <div style={styles.tabBar}>
            <button
              onClick={() => setActiveTab('shorten')}
              style={{ ...styles.tab, ...(activeTab === 'shorten' ? styles.tabActive : {}) }}
            >
              🔗 Shorten a Link
            </button>
            <button
              onClick={() => setActiveTab('qr')}
              style={{ ...styles.tab, ...(activeTab === 'qr' ? styles.tabActive : {}) }}
            >
              ⬡ Generate QR Code
            </button>
          </div>

          <div style={styles.cardBody}>
            {activeTab === 'shorten' ? <UrlForm /> : <QRGenerator />}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="home-features" style={styles.features}>
        {[
          { icon: '⚡', title: 'Lightning Fast', desc: 'Links generated in milliseconds, redirects in under 100ms globally.' },
          { icon: '📊', title: 'Click Analytics', desc: 'Track how many times your link was clicked after logging in.' },
          { icon: '🔒', title: 'Secure & Reliable', desc: 'All links are HTTPS secured and monitored 24/7.' },
          { icon: '📱', title: 'QR Codes', desc: 'Generate scannable QR codes for any URL instantly.' },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={styles.featureCard}>
            <div style={styles.featureIcon}>{icon}</div>
            <h3 style={styles.featureTitle}>{title}</h3>
            <p style={styles.featureDesc}>{desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="home-footer" style={styles.footer}>
        <span style={styles.logoText}>ShortUrl<span style={{ color: '#9d8420' }}>4U</span></span>
        <span style={{ color: '#6b6870', fontSize: 13 }}>© 2026 — Free URL Shortener</span>
      </footer>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    background: '#fcfaf9',
    fontFamily: "'Outfit', sans-serif",
    color: '#2d3142',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: 'linear-gradient(135deg, rgba(47,102,144,0.06), transparent 42%), linear-gradient(315deg, rgba(157,132,32,0.05), transparent 38%)',
  },
  navCta: {
    background: '#2f6690',
    color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 500,
    padding: '8px 20px', borderRadius: 8,
  },
  hero: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: 72, padding: '92px 64px 104px',
    maxWidth: 1440, margin: '0 auto',
    flexWrap: 'wrap',
  },
  heroLeft: {
    flex: 1, minWidth: 280,
    animation: 'fadeUp 0.7s ease both',
  },
  badge: {
    display: 'inline-block',
    background: 'rgba(47,102,144,0.1)',
    border: '1px solid rgba(47,102,144,0.22)',
    color: '#2f6690', fontSize: 13, fontWeight: 600,
    padding: '6px 14px', borderRadius: 20, marginBottom: 20,
  },
  heroTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 'clamp(3rem, 6vw, 5.75rem)',
    lineHeight: 1.1, margin: '0 0 20px',
    color: '#2d3142',
  },
  heroSub: {
    fontSize: 18, color: '#5f626c', lineHeight: 1.7,
    margin: '0 0 38px', maxWidth: 500,
  },
  statsRow: { display: 'flex', gap: 44 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2 },
  statVal: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 25, color: '#9d8420',
  },
  statLabel: { fontSize: 12, color: '#77747a', textTransform: 'uppercase', letterSpacing: '0.1em' },

  // Card
  card: {
    flex: 1, minWidth: 360, maxWidth: 590,
    background: '#ffffff',
    border: '1px solid rgba(45,49,66,0.12)',
    borderRadius: 18,
    overflow: 'hidden',
    animation: 'fadeUp 0.7s ease 0.15s both',
    boxShadow: '0 24px 60px rgba(45,49,66,0.14)',
  },
  tabBar: {
    display: 'flex',
    borderBottom: '1px solid rgba(45,49,66,0.1)',
  },
  tab: {
    flex: 1, padding: '16px 8px',
    background: 'transparent', border: 'none',
    color: '#77747a', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s',
  },
  tabActive: {
    color: '#2f6690',
    borderBottom: '2px solid #2f6690',
    background: 'rgba(47,102,144,0.06)',
  },
  cardBody: { padding: 28 },

  // Form elements used by QRGenerator
  label: {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: '#77747a', textTransform: 'uppercase',
    letterSpacing: '0.1em', marginBottom: 8,
  },
  input: {
    width: '100%', background: '#fcfaf9',
    border: '1px solid rgba(45,49,66,0.16)',
    borderRadius: 10, padding: '12px 16px',
    color: '#2d3142', fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    transition: 'border-color 0.2s',
  },
  primaryBtn: {
    width: '100%',
    background: '#2f6690',
    border: 'none', borderRadius: 10,
    color: '#fff', fontSize: 15, fontWeight: 600,
    padding: '13px 20px', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    transition: 'transform 0.15s, opacity 0.15s',
  },
  outlineBtn: {
    width: '100%', marginTop: 12,
    background: 'transparent',
    border: '1px solid rgba(157,132,32,0.55)',
    borderRadius: 10, color: '#806b16',
    fontSize: 14, fontWeight: 500,
    padding: '10px 20px', cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },
  qrResult: {
    background: 'rgba(47,102,144,0.05)',
    border: '1px solid rgba(47,102,144,0.16)',
    borderRadius: 12, padding: 20,
  },

  // Features
  features: {
    position: 'relative', zIndex: 1,
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 22, padding: '0 64px 88px',
    maxWidth: 1440, margin: '0 auto',
  },
  featureCard: {
    background: '#ffffff',
    border: '1px solid rgba(45,49,66,0.1)',
    borderRadius: 16, padding: '24px 20px',
    transition: 'border-color 0.2s',
  },
  featureIcon: { fontSize: 28, marginBottom: 12 },
  featureTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 16, margin: '0 0 8px', color: '#2d3142',
  },
  featureDesc: { fontSize: 13, color: '#6b6870', lineHeight: 1.6, margin: 0 },

  // Footer
  footer: {
    position: 'relative', zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '24px 64px',
    borderTop: '1px solid rgba(45,49,66,0.1)',
  },
};

export default HomePage;