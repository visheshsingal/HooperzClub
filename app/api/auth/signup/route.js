import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb.js';
import { signToken } from '../../../../lib/auth.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Name, email and password are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await users.insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = signToken({ userId: user.insertedId.toString(), email: email.toLowerCase(), name });

    return new Response(JSON.stringify({ token }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
