import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../lib/api';

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="glow-card p-6 bg-surface/60 flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="skeleton w-32 h-5" />
        <div className="skeleton w-16 h-5 rounded-full" />
      </div>
      <div className="skeleton w-24 h-3" />
      <div className="skeleton w-full h-9 mt-auto rounded-xl" />
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('vibekit_token');
    if (!token) { navigate('/login'); return; }
    fetchPages();
  }, [navigate]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const data = await api.getPages();
      if (data.pages) setPages(data.pages);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handlePublishToggle = async (id, currentStatus) => {
    try {
      setPages(pages.map(p => p._id === id ? { ...p, _loadingPub: true } : p));
      const action = currentStatus ? 'unpublish' : 'publish';
      const data = await api.publishPage(id, action);
      if (data.page) {
        setPages(pages.map(p => p._id === id ? data.page : p));
      }
    } catch {
      alert('Failed to update publish state.');
    } finally {
      setPages(pages => pages.map(p => p._id === id ? { ...p, _loadingPub: false } : p));
    }
  };

  const handleCreatePage = async () => {
    setCreating(true);
    try {
      const data = await api.createPage('Untitled Page', 'minimal');
      if (data.page?._id) {
        navigate(`/editor/${data.page._id}`);
      }
    } catch {
      alert('Failed to create page.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch {} 
    localStorage.removeItem('vibekit_token');
    navigate('/login');
  };

  const handleDuplicatePage = async (id) => {
    try {
      setPages(pages.map(p => p._id === id ? { ...p, _loadingDup: true } : p));
      const data = await api.duplicatePage(id);
      if (data.page) {
        setPages([data.page, ...pages.map(p => p._id === id ? { ...p, _loadingDup: false } : p)]);
      }
    } catch {
      alert('Failed to duplicate page.');
      setPages(pages.map(p => p._id === id ? { ...p, _loadingDup: false } : p));
    }
  };

  const [copiedId, setCopiedId] = useState(null);
  const handleCopyUrl = (id, slug) => {
    navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const themeLabels = {
    minimal: 'Minimal', dark: 'Dark', pastel: 'Pastel',
    neobrutal: 'Neo-brutal', luxury: 'Luxury', retro: 'Retro',
  };

  return (
    <div className="w-full min-h-screen bg-background relative">
      <div className="absolute inset-0 dot-grid opacity-15 pointer-events-none" />

      {/* ── Header ── */}
      <header className="border-b border-white/[0.06] px-5 py-3 flex items-center justify-between relative z-10 bg-background/80 backdrop-blur-sm">
        <Link to="/" className="text-lg font-bold text-primary tracking-tight">VibeKit Studio</Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="create-page-btn"
            onClick={handleCreatePage}
            disabled={creating}
            className="btn-primary px-4 sm:px-5 py-2 text-sm gap-1.5"
          >
            {creating ? 'Creating...' : '+ New Page'}
          </button>
          <button onClick={handleLogout} className="text-sm text-slate-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px]">
            Log Out
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <main className="max-w-6xl mx-auto px-5 py-8 relative z-10">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Your Pages</h1>
          <p className="text-slate-500 text-sm">Create, edit, and publish your mini-sites</p>
        </div>

        {loading ? (
          /* ── Skeleton loading state ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : pages.length === 0 ? (
          /* ── Empty state ── */
          <div className="text-center py-16 px-6 rounded-2xl border-2 border-dashed border-white/[0.08] bg-surface/20">
            <div className="text-5xl mb-4">🎨</div>
            <h2 className="text-xl font-bold text-white mb-2">No pages yet</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto text-sm">
              Click "New Page" to start building your first themed mini-site.
            </p>
            <button onClick={handleCreatePage} disabled={creating} className="btn-primary px-6 py-3">
              {creating ? 'Creating...' : 'Create Your First Page'}
            </button>
          </div>
        ) : (
          /* ── Pages grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pages.map((page) => (
              <div key={page._id} className="glow-card p-5 bg-surface/60 flex flex-col gap-3 group">
                {/* Title + theme */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-white leading-snug group-hover:text-primary transition-colors truncate">
                    {page.title}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider bg-white/[0.06] text-slate-400">
                    {themeLabels[page.theme] || page.theme}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${page.isPublished ? 'bg-green-400' : 'bg-yellow-400'}`} />
                    <span>{page.isPublished ? 'Published' : 'Draft'}</span>
                  </div>
                  {page.isPublished && <span>{page.viewCount || 0} views</span>}
                </div>

                {/* URL bar */}
                {page.isPublished && page.slug && (
                  <div className="bg-background/60 rounded-lg border border-white/[0.06] p-2 text-xs flex items-center justify-between">
                    <span className="text-slate-500 truncate pr-2 font-mono">/p/{page.slug}</span>
                    <button 
                      onClick={() => handleCopyUrl(page._id, page.slug)}
                      className="text-primary hover:text-primary-light font-semibold shrink-0 transition-colors min-h-[28px] px-2"
                    >
                      {copiedId === page._id ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-2 pt-1">
                  <div className="flex gap-2">
                    <Link
                      to={`/editor/${page._id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/[0.08] text-slate-300 text-sm hover:border-primary/40 hover:text-primary transition-all min-h-[44px]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDuplicatePage(page._id)}
                      disabled={page._loadingDup}
                      className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-xl border border-white/[0.08] text-slate-400 text-sm hover:border-primary/40 hover:text-primary transition-all min-h-[44px]"
                      title="Duplicate"
                    >
                      {page._loadingDup ? '...' : 'Clone'}
                    </button>
                  </div>
                  <button
                    onClick={() => handlePublishToggle(page._id, page.isPublished)}
                    disabled={page._loadingPub}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                      page.isPublished 
                        ? 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-white/[0.06]' 
                        : 'bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20'
                    }`}
                  >
                    {page._loadingPub ? '...' : page.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            ))}

            {/* Create new card */}
            <button
              onClick={handleCreatePage}
              disabled={creating}
              className="p-5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/[0.08] rounded-2xl bg-surface/20 hover:border-primary/30 hover:bg-surface/40 transition-all min-h-[200px] text-slate-500 hover:text-primary"
            >
              <span className="text-3xl">+</span>
              <span className="text-sm font-medium">New Page</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
