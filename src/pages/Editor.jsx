import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

// ─────────────────────────────────────────────
// Theme definitions — CSS variable maps
// ─────────────────────────────────────────────
const THEMES = {
  minimal: {
    label: 'Minimal',
    vars: {
      '--vk-bg': '#ffffff',
      '--vk-surface': '#f5f5f5',
      '--vk-text': '#111111',
      '--vk-subtle': '#555555',
      '--vk-accent': '#6d28d9',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#e5e7eb',
      '--vk-card': '#ffffff',
      '--vk-hero-bg': 'linear-gradient(135deg,#f0f0ff 0%,#e8f0fe 100%)',
    },
  },
  dark: {
    label: 'Dark',
    vars: {
      '--vk-bg': '#0a0a0f',
      '--vk-surface': '#13131a',
      '--vk-text': '#f0f0ff',
      '--vk-subtle': '#9ca3af',
      '--vk-accent': '#a855f7',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#2d2d3d',
      '--vk-card': '#1a1a2e',
      '--vk-hero-bg': 'linear-gradient(135deg,#0f0c29 0%,#302b63 60%,#24243e 100%)',
    },
  },
  pastel: {
    label: 'Pastel',
    vars: {
      '--vk-bg': '#fff0f6',
      '--vk-surface': '#ffe4ef',
      '--vk-text': '#4a1942',
      '--vk-subtle': '#8b5e7e',
      '--vk-accent': '#e879a8',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#f9c8de',
      '--vk-card': '#fff5f9',
      '--vk-hero-bg': 'linear-gradient(135deg,#fce4ec 0%,#f8bbd0 50%,#fce4ec 100%)',
    },
  },
  neobrutal: {
    label: 'Neo-brutal',
    vars: {
      '--vk-bg': '#ffde59',
      '--vk-surface': '#ffffff',
      '--vk-text': '#000000',
      '--vk-subtle': '#333333',
      '--vk-accent': '#ff3b30',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#000000',
      '--vk-card': '#ffffff',
      '--vk-hero-bg': '#ffde59',
    },
  },
  luxury: {
    label: 'Luxury',
    vars: {
      '--vk-bg': '#fcfaf8',
      '--vk-surface': '#f3eee8',
      '--vk-text': '#2c2a29',
      '--vk-subtle': '#75706b',
      '--vk-accent': '#d4af37',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#e2dbd3',
      '--vk-card': '#ffffff',
      '--vk-hero-bg': 'linear-gradient(135deg,#fdfcfb 0%,#e2d1c3 100%)',
    },
  },
  retro: {
    label: 'Retro',
    vars: {
      '--vk-bg': '#f4ebd0',
      '--vk-surface': '#e6d5b8',
      '--vk-text': '#493323',
      '--vk-subtle': '#856c53',
      '--vk-accent': '#ff7e67',
      '--vk-accent-text': '#ffffff',
      '--vk-border': '#d1b99b',
      '--vk-card': '#fffcf5',
      '--vk-hero-bg': 'repeating-linear-gradient(45deg,#f4ebd0,#f4ebd0 10px,#e6d5b8 10px,#e6d5b8 20px)',
    },
  },
};

// ─────────────────────────────────────────────
// Live Preview Component
// ─────────────────────────────────────────────
function LivePreview({ pageData, previewWidth }) {
  const theme = THEMES[pageData.theme] || THEMES.minimal;
  const { content } = pageData;

  const containerStyle = {
    ...Object.fromEntries(Object.entries(theme.vars)),
    backgroundColor: 'var(--vk-bg)',
    color: 'var(--vk-text)',
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100%',
  };

  const widthMap = { mobile: '375px', tablet: '768px', desktop: '100%' };
  const maxDesktopWidth = '1200px';

  return (
    <div className="flex flex-col h-full">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2.5 bg-surface/40 backdrop-blur-sm shrink-0">
        <span className="text-xs font-semibold text-primary uppercase tracking-widest">Live Preview</span>
        <div className="flex gap-1 bg-background/60 rounded-lg p-0.5">
          {['mobile', 'tablet', 'desktop'].map(w => (
            <button key={w}
              onClick={() => previewWidth.set(w)}
              className={`px-3 py-1 text-xs rounded-md transition-all font-medium ${previewWidth.value === w ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >{w[0].toUpperCase() + w.slice(1)}</button>
          ))}
        </div>
      </div>

      {/* Preview frame */}
      <div className="flex-1 overflow-auto bg-background p-4 flex justify-center items-start">
        <div
          style={{ width: widthMap[previewWidth.value], maxWidth: previewWidth.value === 'desktop' ? maxDesktopWidth : '100%', transition: 'all 0.3s ease' }}
          className={`overflow-hidden rounded-xl shadow-2xl bg-white flex flex-col ${previewWidth.value === 'desktop' ? 'w-full min-h-full' : 'min-h-[800px]'}`}
        >
          <div style={{ ...containerStyle, flex: 1 }}>
            {/* HERO */}
            <section style={{ background: 'var(--vk-hero-bg)', padding: '80px 40px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px', color: 'var(--vk-text)' }}>
                {content.hero?.title || 'Welcome'}
              </h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--vk-subtle)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px' }}>
                {content.hero?.subtitle || 'Your subtitle here'}
              </p>
              {content.hero?.buttonText && (
                <a href={content.hero.buttonLink || '#'}
                  style={{ display: 'inline-block', background: 'var(--vk-accent)', color: 'var(--vk-accent-text)', padding: '14px 32px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '1rem' }}>
                  {content.hero.buttonText}
                </a>
              )}
            </section>

            {/* FEATURES */}
            {content.features?.length > 0 && (
              <section style={{ padding: '64px 40px', background: 'var(--vk-bg)' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '40px', color: 'var(--vk-text)' }}>Features</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                  {content.features.map((f, i) => (
                    <div key={i} style={{ background: 'var(--vk-card)', border: '1px solid var(--vk-border)', borderRadius: '12px', padding: '28px 24px' }}>
                      <h3 style={{ fontWeight: 700, marginBottom: '10px', color: 'var(--vk-text)', fontSize: '1.1rem' }}>{f.title}</h3>
                      <p style={{ color: 'var(--vk-subtle)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* GALLERY */}
            {content.gallery?.length > 0 && (
              <section style={{ padding: '64px 40px', background: 'var(--vk-surface)' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, marginBottom: '40px', color: 'var(--vk-text)' }}>Gallery</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {content.gallery.filter(u => u).map((url, i) => (
                    <img key={i} src={url} alt={`Gallery ${i + 1}`}
                      style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--vk-border)' }}
                      onError={(e) => { e.target.src = `https://placehold.co/400x225/purple/white?text=Image+${i+1}`; }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* CONTACT */}
            {content.contact?.email && (
              <section style={{ padding: '64px 40px', textAlign: 'center', background: 'var(--vk-bg)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '16px', color: 'var(--vk-text)' }}>Contact</h2>
                <a href={`mailto:${content.contact.email}`}
                  style={{ color: 'var(--vk-accent)', fontSize: '1.1rem', textDecoration: 'none', fontWeight: 600 }}>
                  {content.contact.email}
                </a>
              </section>
            )}

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--vk-border)', padding: '24px 40px', textAlign: 'center', color: 'var(--vk-subtle)', fontSize: '0.8rem' }}>
              Built with VibeKit Studio
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Editor Page
// ─────────────────────────────────────────────
export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [previewWidthValue, setPreviewWidthValue] = useState('desktop');

  const previewWidth = { value: previewWidthValue, set: setPreviewWidthValue };

  useEffect(() => {
    const token = localStorage.getItem('vibekit_token');
    if (!token) { navigate('/login'); return; }
    loadPage();
  }, [id]);

  const loadPage = async () => {
    const data = await api.getPage(id);
    if (data.page) setPageData(data.page);
    else navigate('/app');
  };

  const update = useCallback((path, value) => {
    setPageData(prev => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }, []);

  const addFeature = () => setPageData(prev => ({ ...prev, content: { ...prev.content, features: [...(prev.content.features || []), { title: '', description: '' }] } }));
  const removeFeature = (i) => setPageData(prev => ({ ...prev, content: { ...prev.content, features: prev.content.features.filter((_, idx) => idx !== i) } }));
  const updateFeature = (i, field, val) => setPageData(prev => {
    const features = structuredClone(prev.content.features);
    features[i][field] = val;
    return { ...prev, content: { ...prev.content, features } };
  });
  const reorderFeature = (i, dir) => setPageData(prev => {
    const features = structuredClone(prev.content.features);
    if (dir === 'up' && i > 0) {
      [features[i-1], features[i]] = [features[i], features[i-1]];
    } else if (dir === 'down' && i < features.length - 1) {
      [features[i], features[i+1]] = [features[i+1], features[i]];
    }
    return { ...prev, content: { ...prev.content, features } };
  });

  const addGalleryUrl = () => setPageData(prev => ({ ...prev, content: { ...prev.content, gallery: [...(prev.content.gallery || []), ''] } }));
  const removeGalleryUrl = (i) => setPageData(prev => ({ ...prev, content: { ...prev.content, gallery: prev.content.gallery.filter((_, idx) => idx !== i) } }));
  const updateGalleryUrl = (i, val) => setPageData(prev => {
    const gallery = [...prev.content.gallery];
    gallery[i] = val;
    return { ...prev, content: { ...prev.content, gallery } };
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.updatePage(id, { title: pageData.title, theme: pageData.theme, content: pageData.content });
      setSavedMsg('Saved!');
      setTimeout(() => setSavedMsg(''), 2500);
    } catch {
      setSavedMsg('Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (!pageData) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-600">Loading editor...</span>
    </div>
  );

  const inputCls = 'w-full px-3 py-2.5 bg-background border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all';
  const labelCls = 'block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5';
  const sectionCls = 'p-5 rounded-2xl bg-surface/60 border border-white/[0.06] space-y-4';
  const sectionHeadCls = 'text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2';

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-background/90 backdrop-blur-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app')} className="text-slate-400 hover:text-white transition-colors text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Dashboard
          </button>
          <span className="w-px h-4 bg-white/[0.08]"></span>
          <h1 className="text-sm font-semibold text-slate-200 truncate max-w-[240px]">{pageData.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          {savedMsg && <span className={`text-xs font-medium px-3 py-1 rounded-full ${savedMsg === 'Saved!' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>{savedMsg}</span>}
          <button onClick={handleSave} disabled={saving} className="btn-primary px-5 py-2 text-sm gap-2">
            {saving ? (
              <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving...</span>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>Save</>
            )}
          </button>
        </div>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Form Panel ── */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-white/[0.06] bg-surface/30 p-5 space-y-5">

          {/* Page meta */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>📄 Page Settings</p>
            <div>
              <label className={labelCls}>Page Title</label>
              <input className={inputCls} value={pageData.title} onChange={e => update('title', e.target.value)} placeholder="My Awesome Page" />
            </div>
            <div>
              <label className={labelCls}>Theme</label>
              <select className={inputCls} value={pageData.theme} onChange={e => update('theme', e.target.value)}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <option key={key} value={key}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hero section */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>🦸 Hero Section</p>
            {[['content.hero.title', 'Headline', 'Your big headline'], ['content.hero.subtitle', 'Subtitle', 'A short description'], ['content.hero.buttonText', 'Button Text', 'Get Started'], ['content.hero.buttonLink', 'Button URL', 'https://']].map(([path, label, ph]) => (
              <div key={path}>
                <label className={labelCls}>{label}</label>
                <input className={inputCls} value={path.split('.').reduce((o, k) => o?.[k], pageData) || ''} onChange={e => update(path, e.target.value)} placeholder={ph} />
              </div>
            ))}
          </div>

          {/* Features */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-3">
              <p className={sectionHeadCls} style={{ marginBottom: 0 }}>⚡ Features</p>
              <button onClick={addFeature} className="text-xs text-primary hover:text-primary-hover border border-primary/40 px-2 py-1 rounded transition-colors">+ Add</button>
            </div>
            {(pageData.content.features || []).map((f, i) => (
              <div key={i} className="bg-slate-900 rounded-lg p-3 space-y-2 relative">
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => reorderFeature(i, 'up')} disabled={i === 0} className="text-slate-500 hover:text-white disabled:opacity-30">↑</button>
                  <button onClick={() => reorderFeature(i, 'down')} disabled={i === (pageData.content.features?.length || 0)-1} className="text-slate-500 hover:text-white disabled:opacity-30">↓</button>
                  <button onClick={() => removeFeature(i)} className="text-slate-600 hover:text-red-400 text-xs ml-2">✕</button>
                </div>
                <input className={inputCls} value={f.title} onChange={e => updateFeature(i, 'title', e.target.value)} placeholder="Feature title" style={{ paddingRight: '60px' }} />
                <textarea className={`${inputCls} resize-none`} rows={2} value={f.description} onChange={e => updateFeature(i, 'description', e.target.value)} placeholder="Feature description" />
              </div>
            ))}
            {!pageData.content.features?.length && <p className="text-xs text-slate-600 text-center py-2">No features yet. Click + Add.</p>}
          </div>

          {/* Gallery */}
          <div className={sectionCls}>
            <div className="flex items-center justify-between mb-3">
              <p className={sectionHeadCls} style={{ marginBottom: 0 }}>🖼 Gallery</p>
              <button onClick={addGalleryUrl} className="text-xs text-primary hover:text-primary-hover border border-primary/40 px-2 py-1 rounded transition-colors">+ Add URL</button>
            </div>
            {(pageData.content.gallery || []).map((url, i) => (
              <div key={i} className="flex gap-2">
                <input className={inputCls} value={url} onChange={e => updateGalleryUrl(i, e.target.value)} placeholder="https://image-url.com/file.jpg" />
                <button onClick={() => removeGalleryUrl(i)} className="text-slate-500 hover:text-red-400 text-lg px-1 transition-colors">✕</button>
              </div>
            ))}
            {!pageData.content.gallery?.length && <p className="text-xs text-slate-600 text-center py-2">No images yet. Click + Add URL.</p>}
          </div>

          {/* Contact */}
          <div className={sectionCls}>
            <p className={sectionHeadCls}>📬 Contact</p>
            <div>
              <label className={labelCls}>Email Address</label>
              <input className={inputCls} type="email" value={pageData.content.contact?.email || ''} onChange={e => update('content.contact.email', e.target.value)} placeholder="hello@yoursite.com" />
            </div>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <LivePreview pageData={pageData} previewWidth={previewWidth} />
        </div>
      </div>
    </div>
  );
}
