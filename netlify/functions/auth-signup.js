import { connectToDatabase } from '../../lib/db.js';
import User from '../../lib/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Email and password are required' }) };
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { statusCode: 409, body: JSON.stringify({ message: 'User already exists' }) };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const jwtSecret = process.env.JWT_SECRET || 'default_fallback_secret_only_for_dev';
    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '7d' });

    const setCookie = cookie.serialize('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    });

    return {
      statusCode: 201,
      headers: { 'Set-Cookie': setCookie },
      body: JSON.stringify({ message: 'User created successfully', token }),
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', detail: error.message }),
    };
  }
};
