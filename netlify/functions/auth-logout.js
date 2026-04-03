import cookie from 'cookie';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: '[]' };

  try {
    const clearCookie = cookie.serialize('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return {
      statusCode: 200,
      headers: { 'Set-Cookie': clearCookie },
      body: JSON.stringify({ message: 'Logged out successfully' }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ message: 'Internal Server Error' }) };
  }
};
