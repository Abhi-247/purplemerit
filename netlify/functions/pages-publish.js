import { connectToDatabase } from '../../lib/db.js';
import Page from '../../lib/Page.js';
import jwt from 'jsonwebtoken';

const getUserIdFromEvent = (event) => {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    return jwt.verify(token, jwtSecret).userId;
  }
  const cookies = event.headers?.cookie || '';
  const jwtCookie = cookies.split(';').find(c => c.trim().startsWith('jwt='));
  if (jwtCookie) {
    const token = jwtCookie.split('=')[1].trim();
    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    return jwt.verify(token, jwtSecret).userId;
  }
  throw new Error('Unauthorized');
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '[]' };

  try {
    const userId = getUserIdFromEvent(event);
    const { id, action } = JSON.parse(event.body || '{}');

    if (!id || !['publish', 'unpublish'].includes(action)) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid payload' }) };
    }

    await connectToDatabase();
    const page = await Page.findOne({ _id: id, userId });
    
    if (!page) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Page not found' }) };
    }

    if (action === 'publish') {
      page.isPublished = true;
      if (!page.slug) {
        // Generate a random 6-character string appended to sanitized title
        const baseSlug = page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const randomStr = Math.random().toString(36).substring(2, 8);
        page.slug = `${baseSlug || 'page'}-${randomStr}`;
      }
    } else {
      page.isPublished = false;
    }

    await page.save();

    return { statusCode: 200, body: JSON.stringify({ message: `Page ${action}ed`, page }) };
  } catch (error) {
    console.error('publish error:', error);
    return { statusCode: error.message === 'Unauthorized' ? 401 : 500, body: JSON.stringify({ message: error.message }) };
  }
};
