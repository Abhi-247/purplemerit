// Shared API utility — reads JWT from localStorage and attaches to every request

const getToken = () => localStorage.getItem('vibekit_token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const api = {
  createPage: (title = 'Untitled Page', theme = 'minimal') =>
    fetch('/api/pages-create', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ title, theme }),
    }).then(r => r.json()),

  getPages: () =>
    fetch('/api/pages-get', { headers: headers() }).then(r => r.json()),

  getPage: (id) =>
    fetch(`/api/pages-get?id=${id}`, { headers: headers() }).then(r => r.json()),

  updatePage: (id, data) =>
    fetch(`/api/pages-update?id=${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    }).then(r => r.json()),

  publishPage: (id, action) =>
    fetch('/api/pages-publish', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ id, action }),
    }).then(r => r.json()),

  publicGetPage: (slug) =>
    fetch(`/api/public-pages?slug=${slug}`).then(r => r.json()),

  publicInteract: (slug, type, data) =>
    fetch('/api/public-pages-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, type, data }),
    }).then(r => r.json()),

  duplicatePage: (id) =>
    fetch('/api/pages-duplicate', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ id }),
    }).then(r => r.json()),

  logout: () =>
    fetch('/api/auth-logout', {
      method: 'POST',
    }).then(r => r.json()),
};
