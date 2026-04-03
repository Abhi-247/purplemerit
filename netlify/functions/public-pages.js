import { connectToDatabase } from '../../lib/db.js';
import { Page } from '../../lib/Page.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: '[]' };

  try {
    const slug = event.queryStringParameters?.slug;
    if (!slug) return { statusCode: 400, body: JSON.stringify({ message: 'Slug required' }) };

    await connectToDatabase();
    const page = await Page.findOne({ slug, isPublished: true });

    if (!page) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Page not found or unpublished' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ page }) };
  } catch (error) {
    console.error('public-pages get error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
