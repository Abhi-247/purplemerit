import { connectToDatabase } from '../../lib/db.js';
import { Page } from '../../lib/Page.js';
import { ContactSubmission } from '../../lib/ContactSubmission.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '[]' };

  try {
    const { slug, type, data } = JSON.parse(event.body || '{}');
    if (!slug || !['view', 'contact'].includes(type)) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Invalid payload' }) };
    }

    await connectToDatabase();
    const page = await Page.findOne({ slug, isPublished: true });
    
    if (!page) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Page not found' }) };
    }

    if (type === 'view') {
      page.viewCount += 1;
      await page.save();
      return { statusCode: 200, body: JSON.stringify({ message: 'View counted' }) };
    }

    if (type === 'contact') {
      const { name, email, message } = data || {};
      if (!name || !email || !message) {
        return { statusCode: 400, body: JSON.stringify({ message: 'All fields required' }) };
      }
      const submission = new ContactSubmission({
        pageId: page._id,
        name,
        email,
        message
      });
      await submission.save();
      return { statusCode: 201, body: JSON.stringify({ message: 'Message sent' }) };
    }

  } catch (error) {
    console.error('public interaction error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
