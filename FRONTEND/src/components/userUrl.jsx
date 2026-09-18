import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllUserUrls } from '../api/user.api';

const shortUrlBase = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/+$/, '');

const ClickBar = ({ clicks, max }) => {
  const pct = max > 0 ? (clicks / max) * 100 : 0;
  return (
    <div style={styles.barWrap}>
      <div style={styles.barTrack}>
        <div
          style={{
            ...styles.barFill,
            width: `${pct}%`,
            background: pct > 66
              ? 'linear-gradient(90deg, #2f6690, #5b8fb5)'
              : pct > 33
              ? 'linear-gradient(90deg, #2d5678, #2f6690)'
              : 'linear-gradient(90deg, #806b16, #9d8420)',
          }}
        />
      </div>
      <span style={styles.barLabel}>{clicks}</span>
    </div>
  );
};

const UserUrl = () => {
  const { data: urls, isLoading, isError, error } = useQuery({
    queryKey: ['userUrls'],
    queryFn: getAllUserUrls,
    refetchInterval: 30000,
    staleTime: 0,
  });

  const [copiedId, setCopiedId] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'chart'

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truncate = (str, max) => str?.length > max ? str.slice(0, max) + '…' : str;

  if (isLoading) {
    return (
      <div style={styles.centerBox}>
        <div style={styles.spinner} />
        <p style={{ color: '#5f626c', fontSize: 13, marginTop: 12 }}>Loading your URLs...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={styles.errorBox}>
        <span style={{ fontSize: 18 }}>⚠</span>
        <div>
          <div style={{ fontWeight: 600, marginBottom: 2 }}>Error loading your URLs</div>
          <div style={{ fontSize: 12, color: '#806b16' }}>{error.message}</div>
        </div>
      </div>
    );
  }

  const urlList = urls?.urls;

  if (!urlList || urlList.length === 0) {
    return (
      <div style={styles.emptyBox}>
        <div style={styles.emptyIcon}>🔗</div>
        <p style={styles.emptyTitle}>No URLs yet</p>
        <p style={styles.emptySub}>Shorten your first URL above to see it here.</p>
      </div>
    );
  }

  const sorted = [...urlList].reverse();
  const maxClicks = Math.max(...sorted.map((u) => u.clicks || 0), 1);
  const totalClicks = sorted.reduce((sum, u) => sum + (u.clicks || 0), 0);

  return (
    <div style={styles.wrapper}>
      {/* Header row */}
      <div style={styles.headerRow}>
        <div>
          <span style={styles.countBadge}>{sorted.length} link{sorted.length !== 1 ? 's' : ''}</span>
          <span style={styles.totalClicks}>· {totalClicks} total clicks</span>
        </div>
        <div style={styles.viewToggle}>
          {['list', 'chart'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{ ...styles.toggleBtn, ...(view === v ? styles.toggleActive : {}) }}
            >
              {v === 'list' ? '☰ List' : '▦ Chart'}
            </button>
          ))}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={styles.listWrap}>
          {sorted.map((url) => (
            <div key={url._id} style={styles.urlCard}>
              {/* URLs */}
              <div style={styles.urlInfo}>
                <div style={styles.originalUrl} title={url.full_url}>
                  {truncate(url.full_url, 48)}
                </div>
                <a
                  href={`${shortUrlBase}/${url.short_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.shortUrl}
                >
                  ↗ {shortUrlBase}/{url.short_url}
                </a>
              </div>

              {/* Click bar */}
              <div style={styles.clickSection}>
                <span style={styles.clickLabel}>Clicks</span>
                <ClickBar clicks={url.clicks || 0} max={maxClicks} />
              </div>

              {/* Copy btn */}
              <button
                onClick={() => handleCopy(`${shortUrlBase}/${url.short_url}`, url._id)}
                style={{
                  ...styles.copyBtn,
                  background: copiedId === url._id
                    ? 'rgba(46,125,92,0.14)'
                    : 'rgba(47,102,144,0.08)',
                  borderColor: copiedId === url._id
                    ? 'rgba(46,125,92,0.4)'
                    : 'rgba(47,102,144,0.2)',
                  color: copiedId === url._id ? '#2e7d5c' : '#2f6690',
                }}
              >
                {copiedId === url._id ? '✓ Copied!' : '⧉ Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CHART VIEW */}
      {view === 'chart' && (
        <div style={styles.chartWrap}>
          <p style={styles.chartTitle}>Click Analytics</p>
          <div style={styles.chartBars}>
            {sorted.map((url) => {
              const pct = maxClicks > 0 ? ((url.clicks || 0) / maxClicks) * 100 : 0;
              return (
                <div key={url._id} style={styles.chartCol}>
                  <span style={styles.chartCount}>{url.clicks || 0}</span>
                  <div style={styles.chartBarWrap}>
                    <div
                      style={{
                        ...styles.chartBar,
                        height: `${Math.max(pct, 4)}%`,
                        background: pct > 66
                          ? 'linear-gradient(180deg, #5b8fb5, #2f6690)'
                          : pct > 33
                          ? 'linear-gradient(180deg, #2f6690, #2d5678)'
                          : 'linear-gradient(180deg, #9d8420, #806b16)',
                      }}
                    />
                  </div>
                  <span style={styles.chartUrlLabel} title={url.short_url}>
                    {url.short_url}
                  </span>
                  <button
                    onClick={() => handleCopy(`${shortUrlBase}/${url.short_url}`, url._id)}
                    style={{
                      ...styles.chartCopyBtn,
                      color: copiedId === url._id ? '#2e7d5c' : '#5f626c',
                    }}
                  >
                    {copiedId === url._id ? '✓' : '⧉'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Summary stats */}
          <div style={styles.statsRow}>
            {[
              { label: 'Total Links', val: sorted.length },
              { label: 'Total Clicks', val: totalClicks },
              { label: 'Most Clicked', val: maxClicks },
              { label: 'Avg Clicks', val: (totalClicks / sorted.length).toFixed(1) },
            ].map(({ label, val }) => (
              <div key={label} style={styles.statBox}>
                <span style={styles.statVal}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: { fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', gap: 16 },

  headerRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
  },
  countBadge: {
    background: 'rgba(47,102,144,0.1)', border: '1px solid rgba(47,102,144,0.2)',
    color: '#2f6690', fontSize: 12, fontWeight: 600,
    padding: '3px 10px', borderRadius: 20,
  },
  totalClicks: { fontSize: 12, color: '#5f626c', marginLeft: 8 },
  viewToggle: { display: 'flex', gap: 4 },
  toggleBtn: {
    background: 'transparent', border: '1px solid rgba(45,49,66,0.12)',
    borderRadius: 8, color: '#5f626c', fontSize: 12, fontWeight: 500,
    padding: '5px 12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    transition: 'all 0.2s',
  },
  toggleActive: {
    background: 'rgba(47,102,144,0.1)', borderColor: 'rgba(47,102,144,0.3)', color: '#2f6690',
  },

  // List view
  listWrap: { display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' },
  urlCard: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    background: '#ffffff', border: '1px solid rgba(45,49,66,0.1)',
    borderRadius: 12, padding: '14px 16px',
    transition: 'border-color 0.2s',
  },
  urlInfo: { flex: 1, minWidth: 160, display: 'flex', flexDirection: 'column', gap: 4 },
  originalUrl: { fontSize: 13, color: '#5f626c', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  shortUrl: { fontSize: 13, color: '#2f6690', textDecoration: 'none', fontWeight: 500 },
  clickSection: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 120 },
  clickLabel: { fontSize: 10, color: '#5f626c', textTransform: 'uppercase', letterSpacing: '0.1em' },

  // Bar (inline)
  barWrap: { display: 'flex', alignItems: 'center', gap: 8 },
  barTrack: {
    flex: 1, height: 6, borderRadius: 99,
    background: 'rgba(45,49,66,0.08)', overflow: 'hidden', minWidth: 80,
  },
  barFill: { height: '100%', borderRadius: 99, transition: 'width 0.5s ease' },
  barLabel: { fontSize: 12, color: '#2f6690', fontWeight: 600, minWidth: 24, textAlign: 'right' },

  copyBtn: {
    border: '1px solid', borderRadius: 8,
    fontSize: 12, fontWeight: 500, padding: '6px 12px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    whiteSpace: 'nowrap', transition: 'all 0.2s',
    flexShrink: 0,
  },

  // Chart view
  chartWrap: { display: 'flex', flexDirection: 'column', gap: 20 },
  chartTitle: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 15, color: '#2d3142', margin: 0,
  },
  chartBars: {
    display: 'flex', alignItems: 'flex-end', gap: 8,
    height: 180, overflowX: 'auto', paddingBottom: 4,
  },
  chartCol: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    gap: 4, minWidth: 52, flex: 1,
  },
  chartCount: { fontSize: 11, color: '#2f6690', fontWeight: 600 },
  chartBarWrap: {
    width: '100%', height: 120,
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  chartBar: {
    width: '70%', borderRadius: '4px 4px 0 0',
    transition: 'height 0.6s ease',
    minHeight: 4,
  },
  chartUrlLabel: {
    fontSize: 10, color: '#5f626c', textAlign: 'center',
    maxWidth: 52, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  chartCopyBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    fontSize: 14, padding: 2, transition: 'color 0.2s',
  },

  // Stats
  statsRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
  },
  statBox: {
    background: 'rgba(157,132,32,0.07)', border: '1px solid rgba(157,132,32,0.18)',
    borderRadius: 10, padding: '12px 8px',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
  },
  statVal: {
    fontFamily: "'Syne', sans-serif", fontWeight: 700,
    fontSize: 18, color: '#9d8420',
  },
  statLabel: { fontSize: 10, color: '#5f626c', textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center' },

  // States
  centerBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 0' },
  spinner: {
    width: 28, height: 28,
    border: '2px solid rgba(47,102,144,0.2)',
    borderTopColor: '#2f6690', borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  errorBox: {
    display: 'flex', alignItems: 'flex-start', gap: 12,
    background: 'rgba(157,132,32,0.1)', border: '1px solid rgba(157,132,32,0.25)',
    borderRadius: 10, padding: '14px 16px', color: '#806b16', fontSize: 14,
  },
  emptyBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '36px 20px', textAlign: 'center',
    background: 'rgba(47,102,144,0.03)', border: '1px dashed rgba(45,49,66,0.15)',
    borderRadius: 12,
  },
  emptyIcon: { fontSize: 36, marginBottom: 12, opacity: 0.4 },
  emptyTitle: { fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, color: '#2d3142', margin: '0 0 6px' },
  emptySub: { fontSize: 13, color: '#5f626c', margin: 0 },
};

export default UserUrl;