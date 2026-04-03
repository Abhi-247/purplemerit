import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Theme preview mini-card ── */
function ThemePreview({ name, bg, surface, accent, text, heroGradient, description }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <div className="glow-card overflow-hidden bg-surface/60">
        {/* Mini preview */}
        <div className="h-44 sm:h-52 relative overflow-hidden" style={{ background: heroGradient }}>
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="w-24 h-3 rounded-full mb-2" style={{ background: text, opacity: 0.7 }} />
            <div className="w-40 h-2 rounded-full" style={{ background: text, opacity: 0.3 }} />
            <div className="mt-4 w-20 h-7 rounded-md" style={{ background: accent }} />
          </div>
        </div>
        {/* Info */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: bg }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: surface }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ background: accent }} />
            </div>
            <h3 className="text-sm font-semibold text-white">{name}</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Feature card ── */
function FeatureCard({ icon, title, desc }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal">
      <div className="glow-card p-6 bg-surface/60">
        <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-lg mb-4">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-white mb-1.5">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════ */
/*              LANDING PAGE                   */
/* ═══════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="w-full min-h-screen flex flex-col relative">
      {/* Skip to content — accessibility */}
      <a href="#hero" className="skip-link">Skip to content</a>

      {/* Background dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      {/* ═══ NAVBAR ═══ */}
      <nav className="w-full flex items-center justify-between px-5 md:px-10 py-4 z-10 relative" role="navigation" aria-label="Main navigation">
        <Link to="/" className="text-lg font-bold text-primary tracking-tight">
          VibeKit Studio
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="text-sm text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/5 min-h-[44px] flex items-center">
            Log In
          </Link>
          <Link to="/signup" className="btn-primary text-sm px-4 sm:px-5 py-2.5">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" className="flex-1 flex flex-col justify-center items-center text-center px-5 pt-8 pb-16 md:pt-16 md:pb-24 z-10 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-5 text-white">
          Generate a theme,{' '}
          <span className="text-primary">build a mini-site,</span>{' '}
          publish it.
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
          Pick from 6 design vibes, add your content with a live editor, and publish a polished page in minutes — no code required.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link to="/signup" className="btn-primary text-base sm:text-lg px-8 py-3.5 gap-2 justify-center">
            Create your first page
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link to="/login" className="btn-secondary text-base sm:text-lg px-8 py-3.5 justify-center">
            Log In
          </Link>
        </div>
      </section>

      {/* ═══ THEME SHOWCASE — 3 examples (required) ═══ */}
      <section className="w-full max-w-6xl mx-auto px-5 pb-20 md:pb-28 z-10" aria-label="Theme showcase">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Choose your vibe</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">6 hand-crafted design presets. Each one defines colors, typography, spacing, and button styles.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <ThemePreview
            name="Minimal"
            bg="#ffffff" surface="#f5f5f5" accent="#6d28d9" text="#111111"
            heroGradient="linear-gradient(135deg,#f0f0ff 0%,#e8f0fe 100%)"
            description="Clean whites and soft grays with a purple accent. Perfect for SaaS and professional pages."
          />
          <ThemePreview
            name="Dark / Neon"
            bg="#0a0a0f" surface="#1a1a2e" accent="#a855f7" text="#f0f0ff"
            heroGradient="linear-gradient(135deg,#0f0c29 0%,#302b63 60%,#24243e 100%)"
            description="Deep navy with electric purple accents. Ideal for developer portfolios and tech products."
          />
          <ThemePreview
            name="Neo-Brutal"
            bg="#ffde59" surface="#ffffff" accent="#ff3b30" text="#000000"
            heroGradient="#ffde59"
            description="Bold yellow and black with hard edges. Great for creative agencies and personal brands."
          />
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">+ 3 more presets: Pastel, Luxury, and Retro — available in the editor.</p>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="w-full max-w-4xl mx-auto px-5 pb-20 md:pb-28 z-10" aria-label="How it works">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">How it works</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">From zero to a published page in three steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-6 left-[18%] right-[18%] h-px bg-white/[0.06]" />

          {[
            { n: '1', title: 'Pick a Theme', desc: 'Choose from 6 design presets that define color, typography, and layout.' },
            { n: '2', title: 'Edit Content', desc: 'Fill in your hero, features, gallery, and contact sections with a live preview.' },
            { n: '3', title: 'Publish', desc: 'Hit publish to get a unique URL. Your page is live and tracking views instantly.' },
          ].map((step) => {
            const ref = useReveal();
            return (
              <div ref={ref} key={step.n} className="reveal flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg font-bold mb-4 shadow-lg shadow-primary/25 relative z-10">
                  {step.n}
                </div>
                <h3 className="text-base font-semibold text-white mb-1.5">{step.title}</h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="w-full max-w-6xl mx-auto px-5 pb-20 md:pb-28 z-10" aria-label="Features">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Built for speed and simplicity</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm sm:text-base">Everything you need to go from idea to published page.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <FeatureCard icon="🎨" title="6 Design Presets" desc="Minimal, dark, pastel, neo-brutal, luxury, and retro — each with distinct typography and colors." />
          <FeatureCard icon="👁️" title="Live Preview" desc="See every edit instantly with responsive desktop, tablet, and mobile preview modes." />
          <FeatureCard icon="🚀" title="One-Click Publish" desc="Go live instantly. Get a unique shareable URL with built-in view tracking." />
          <FeatureCard icon="📄" title="Clone Pages" desc="Duplicate any page to experiment with different themes without losing your original." />
          <FeatureCard icon="📬" title="Contact Forms" desc="Built-in contact form on every published page — submissions are stored in the database." />
          <FeatureCard icon="🔒" title="Secure Auth" desc="Email + password authentication with hashed passwords and JWT-based sessions." />
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="w-full max-w-3xl mx-auto px-5 pb-20 md:pb-28 z-10">
        <div className="text-center p-8 sm:p-12 rounded-2xl border border-white/[0.06] bg-surface/40">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Ready to build your page?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto text-sm sm:text-base">
            Sign up for free and create your first mini-site in minutes.
          </p>
          <Link to="/signup" className="btn-primary text-base sm:text-lg px-8 py-3.5 gap-2">
            Get Started Free
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="w-full border-t border-white/[0.06] py-6 px-5 z-10" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm font-semibold text-primary">VibeKit Studio</span>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} VibeKit Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
