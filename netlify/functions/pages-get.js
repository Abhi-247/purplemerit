import { connectToDatabase } from '../../lib/db.js';
import { Page } from '../../lib/Page.js';
import jwt from 'jsonwebtoken';

const getUserIdFromEvent = (event) => {
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  }
  const cookies = event.headers?.cookie || '';
  const jwtCookie = cookies.split(';').find(c => c.trim().startsWith('jwt='));
  if (jwtCookie) {
    const token = jwtCookie.split('=')[1].trim();
    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  }
  throw new Error('Unauthorized');
};

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const userId = getUserIdFromEvent(event);
    const pageId = event.queryStringParameters?.id;

    await connectToDatabase();

    if (pageId) {
      // Get a specific page
      const page = await Page.findOne({ _id: pageId, userId });
      if (!page) {
        return { statusCode: 404, body: JSON.stringify({ message: 'Page not found' }) };
      }
      return { statusCode: 200, body: JSON.stringify({ page }) };
    } else {
      // Get all pages for the user
      const pages = await Page.find({ userId }).sort({ createdAt: -1 });
      return { statusCode: 200, body: JSON.stringify({ pages }) };
    }
  } catch (error) {
    console.error('pages-get error:', error);
    if (error.message === 'Unauthorized') {
      return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error', detail: error.message }) };
  }
};
