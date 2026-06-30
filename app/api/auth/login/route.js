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

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const users = db.collection('users');

    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
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
