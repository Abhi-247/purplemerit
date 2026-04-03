import { connectToDatabase } from '../../lib/db.js';
import { Page } from '../../lib/Page.js';
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
    const { id } = JSON.parse(event.body || '{}');

    if (!id) return { statusCode: 400, body: JSON.stringify({ message: 'Page ID required' }) };

    await connectToDatabase();
    const original = await Page.findOne({ _id: id, userId });
    
    if (!original) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Page not found' }) };
    }

    const { title, theme, content } = original;

    const newPage = new Page({
      userId,
      title: `${title} (Copy)`,
      theme,
      content,
      isPublished: false,
      viewCount: 0
    });

    await newPage.save();

    return { statusCode: 201, body: JSON.stringify({ message: 'Page duplicated', page: newPage }) };
  } catch (error) {
    return { statusCode: error.message === 'Unauthorized' ? 401 : 500, body: JSON.stringify({ message: error.message }) };
  }
};
