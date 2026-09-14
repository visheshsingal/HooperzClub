import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb.js';
import { signToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword && email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      const token = signToken({ userId: 'admin', email: email.toLowerCase(), name: 'Admin', admin: true });
      return new Response(JSON.stringify({ token, admin: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    if (!client) {
      return new Response(JSON.stringify({ error: 'Database unavailable. Please try again later.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = client.db('hooperzclub');
    const users = db.collection('users');

    const normalizedEmail = email.toLowerCase().trim();
    const user = await users.findOne({ email: normalizedEmail });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    if (user.blocked) {
      return new Response(JSON.stringify({ error: 'This account has been blocked. Contact admin for support.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
