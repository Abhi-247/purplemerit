import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';

const THEMES = {
  minimal: {
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

export default function PublicPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contactState, setContactState] = useState({ name: '', email: '', message: '', status: 'idle' });

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    try {
      const data = await api.publicGetPage(slug);
      if (data.page) {
        setPageData(data.page);
        document.title = data.page.title;
        // Track view
        api.publicInteract(slug, 'view').catch(() => {});
      } else {
        setError(data.message || 'Page not found');
      }
    } catch {
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactState(s => ({ ...s, status: 'loading' }));
    try {
      await api.publicInteract(slug, 'contact', {
        name: contactState.name,
        email: contactState.email,
        message: contactState.message
      });
      setContactState({ name: '', email: '', message: '', status: 'success' });
    } catch {
      setContactState(s => ({ ...s, status: 'error' }));
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white bg-slate-900">Loading...</div>;
  if (error) return <div className="flex flex-col h-screen items-center justify-center text-white bg-slate-900"><h1 className="text-3xl font-bold mb-2">404</h1><p>{error}</p></div>;

  const themeVars = THEMES[pageData.theme]?.vars || THEMES.minimal.vars;
  const { content } = pageData;

  const baseStyle = {
    ...themeVars,
    backgroundColor: 'var(--vk-bg)',
    color: 'var(--vk-text)',
    fontFamily: 'system-ui, sans-serif',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={baseStyle}>
      {/* HERO */}
      <section style={{ background: 'var(--vk-hero-bg)', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '24px', lineHeight: 1.2 }}>
            {content.hero?.title || 'Welcome'}
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--vk-subtle)', marginBottom: '40px', lineHeight: 1.6 }}>
            {content.hero?.subtitle || 'Your subtitle here'}
          </p>
          {content.hero?.buttonText && (
            <a href={content.hero.buttonLink || '#'}
              style={{ display: 'inline-block', background: 'var(--vk-accent)', color: 'var(--vk-accent-text)', padding: '16px 36px', borderRadius: '12px', fontWeight: 600, textDecoration: 'none', fontSize: '1.05rem', transition: 'transform 0.2s' }}>
              {content.hero.buttonText}
            </a>
          )}
        </div>
      </section>

      {/* FEATURES */}
      {content.features?.length > 0 && (
        <section style={{ padding: '80px 20px', background: 'var(--vk-bg)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '60px' }}>Features</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {content.features.map((f, i) => (
                <div key={i} style={{ background: 'var(--vk-card)', border: '1px solid var(--vk-border)', borderRadius: '16px', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: '12px', fontSize: '1.25rem' }}>{f.title}</h3>
                  <p style={{ color: 'var(--vk-subtle)', fontSize: '1rem', lineHeight: 1.6 }}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {content.gallery?.length > 0 && (
        <section style={{ padding: '80px 20px', background: 'var(--vk-surface)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 800, marginBottom: '60px' }}>Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {content.gallery.filter(u => u).map((url, i) => (
                <img key={i} src={url} alt={`Gallery ${i + 1}`}
                  style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '16px', border: '1px solid var(--vk-border)' }}
                  onError={(e) => { e.target.src = `https://placehold.co/400x225/purple/white?text=Image+${i+1}`; }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT DETAILS & FORM */}
      {content.contact?.email && (
        <section style={{ padding: '80px 20px', background: 'var(--vk-bg)' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '24px' }}>Get in Touch</h2>
            <p style={{ color: 'var(--vk-subtle)', marginBottom: '40px' }}>
              Have questions? You can reach us directly at<br/>
              <a href={`mailto:${content.contact.email}`} style={{ color: 'var(--vk-accent)', fontWeight: 600, textDecoration: 'none' }}>{content.contact.email}</a>
            </p>

            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left', background: 'var(--vk-card)', padding: '32px', borderRadius: '16px', border: '1px solid var(--vk-border)' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--vk-subtle)' }}>Name</label>
                <input required value={contactState.name} onChange={e => setContactState(s => ({...s, name: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--vk-border)', background: 'var(--vk-bg)', color: 'var(--vk-text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--vk-subtle)' }}>Email</label>
                <input required type="email" value={contactState.email} onChange={e => setContactState(s => ({...s, email: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--vk-border)', background: 'var(--vk-bg)', color: 'var(--vk-text)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--vk-subtle)' }}>Message</label>
                <textarea required rows={4} value={contactState.message} onChange={e => setContactState(s => ({...s, message: e.target.value}))}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--vk-border)', background: 'var(--vk-bg)', color: 'var(--vk-text)', resize: 'vertical' }} />
              </div>
              
              {contactState.status === 'success' && <p style={{ color: 'green', fontSize: '0.9rem', textAlign: 'center' }}>Message sent successfully!</p>}
              {contactState.status === 'error' && <p style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>Failed to send message.</p>}
              
              <button disabled={contactState.status === 'loading'}
                style={{ background: 'var(--vk-accent)', color: 'var(--vk-accent-text)', padding: '14px', borderRadius: '8px', fontWeight: 600, border: 'none', cursor: 'pointer', marginTop: '8px' }}>
                {contactState.status === 'loading' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--vk-border)', padding: '32px 20px', textAlign: 'center', background: 'var(--vk-surface)' }}>
        <p style={{ color: 'var(--vk-subtle)', fontSize: '0.9rem' }}>Built with <strong>VibeKit Studio</strong></p>
      </footer>
    </div>
  );
}
