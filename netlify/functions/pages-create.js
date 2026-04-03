import { connectToDatabase } from '../../lib/db.js';
import Page from '../../lib/Page.js';
import jwt from 'jsonwebtoken';

const getUserIdFromEvent = (event) => {
  // Check Authorization header
  const auth = event.headers?.authorization || event.headers?.Authorization;
  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7);
    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    const decoded = jwt.verify(token, jwtSecret);
    return decoded.userId;
  }
  // Check cookie
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
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const userId = getUserIdFromEvent(event);
    const { title = 'Untitled Page', theme = 'minimal' } = JSON.parse(event.body || '{}');

    await connectToDatabase();

    const page = new Page({
      userId,
      title,
      theme,
      content: {
        hero: { title: 'Welcome', subtitle: 'Your subtitle here', buttonText: 'Get Started', buttonLink: '#' },
        features: [],
        gallery: [],
        contact: { email: '' },
      },
    });

    await page.save();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Page created', page }),
    };
  } catch (error) {
    console.error('pages-create error:', error);
    if (error.message === 'Unauthorized') {
      return { statusCode: 401, body: JSON.stringify({ message: 'Unauthorized' }) };
    }
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error', detail: error.message }) };
  }
};
