# VibeKit Studio

> **"Generate a theme, build a mini-site, publish it."**

A full-stack web application where users can select a design theme, build a mini-site using a visual page editor, and publish it to a shareable public URL.

## 🚀 Live Demo

**Deployed URL:** _[Add your Netlify URL here]_

**Test Credentials:**
- Email: `test@vibekit.com`
- Password: `password123`

_(Or create a new account via the Sign Up page)_

---

## 🛠 Local Setup

### Prerequisites
- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

```bash
git clone <repo-url>
cd purplemerit
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=your_jwt_secret_here
```

### Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

For Netlify Functions locally:
```bash
npx netlify dev
```

---

## 📁 Project Structure

```
├── netlify/functions/       # Serverless API endpoints
│   ├── auth-signup.js       # POST /api/auth-signup
│   ├── auth-login.js        # POST /api/auth-login
│   ├── auth-logout.js       # POST /api/auth-logout
│   ├── pages-create.js      # POST /api/pages-create
│   ├── pages-get.js         # GET  /api/pages-get
│   ├── pages-update.js      # PUT  /api/pages-update
│   ├── pages-publish.js     # POST /api/pages-publish
│   ├── pages-duplicate.js   # POST /api/pages-duplicate
│   ├── public-pages.js      # GET  /api/public-pages
│   └── public-pages-interaction.js  # POST (view tracking + contact form)
├── lib/                     # Shared backend models
│   ├── db.js                # MongoDB connection
│   ├── User.js              # User model
│   ├── Page.js              # Page model (6 themes)
│   └── ContactSubmission.js # Contact form submissions
├── src/                     # Frontend (React + Vite)
│   ├── pages/
│   │   ├── Landing.jsx      # Marketing landing page
│   │   ├── Login.jsx        # Auth - login
│   │   ├── Signup.jsx       # Auth - signup
│   │   ├── Dashboard.jsx    # Page management
│   │   ├── Editor.jsx       # Page builder with live preview
│   │   └── PublicPage.jsx   # Published page renderer
│   ├── lib/api.js           # API client
│   └── index.css            # Design system (CSS variables)
└── netlify.toml             # Netlify config
```

---

## 🎨 Theme System

6 design presets, each defining a complete set of CSS variables (design tokens):

| Theme | Description |
|-------|-------------|
| **Minimal** | Clean whites, soft gray surface, purple accent |
| **Dark / Neon** | Deep navy background, electric purple accents |
| **Pastel** | Soft pinks and mauves, gentle palette |
| **Neo-Brutal** | Bold yellow + black, hard borders |
| **Luxury** | Warm ivory, gold accent, serif feel |
| **Retro** | Warm tan tones, orange accent, diagonal patterns |

Each preset defines: `--vk-bg`, `--vk-surface`, `--vk-text`, `--vk-subtle`, `--vk-accent`, `--vk-accent-text`, `--vk-border`, `--vk-card`, `--vk-hero-bg`.

**Published pages render identically to the editor preview** — same CSS variables, same layout rules.

---

## ✨ Design Extras (3 chosen)

1. **Micro-interactions** — Button hover/press states, link underline animations, card hover lifts with box-shadow transitions
2. **Subtle animations** — Scroll-reveal (IntersectionObserver-based fade-up), skeleton loading cards on dashboard
3. **Accessibility pass** — Focus-visible rings on all interactive elements, skip-to-content link, `prefers-reduced-motion` support, ARIA labels, semantic HTML, `role="alert"` on error messages, 44px minimum touch targets

---

## 🔐 Security

- Passwords hashed with **bcrypt** (10 salt rounds)
- **JWT** token-based sessions (stored in `localStorage`; `Authorization: Bearer <token>` header)
- Server-side ownership enforcement — users can only read/write their own pages
- Publish/unpublish enforced server-side
- Input validation on all API endpoints
- No secrets committed — all sensitive values in Netlify env vars

---

## 📱 Responsiveness

- **Mobile (320–480px):** Single-column layouts, full-width buttons, no horizontal scrolling
- **Tablet (768–1024px):** 2-column grids where appropriate
- **Desktop (1280px+):** 3-column page grids, side-by-side editor layout
- All primary touch targets ≥ 44px
- No hover-only interactions — all actions accessible via tap
- Typography scales via `sm:`, `md:`, `lg:` breakpoints

---

## ⚖️ Tradeoffs + What I'd Improve Next

1. **JWT in localStorage vs httpOnly cookie** — Used localStorage for simplicity. For production, I'd implement httpOnly cookies with CSRF protection for better XSS resistance.
2. **No image upload** — Gallery uses image URLs. I'd add Cloudinary or S3 integration for direct file uploads with optimized delivery.
3. **Section reorder is per-section (features only)** — The 4 main sections (Hero, Features, Gallery, Contact) have a fixed order. I'd add drag-and-drop reordering for all sections.
4. **No real-time collaboration** — Single-user editing only. I'd add WebSocket-based live collaboration for teams.
5. **No custom domain support** — Pages are served at `/p/:slug`. I'd add CNAME mapping for custom domains on published pages.
