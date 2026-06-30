import { verifyToken } from '../../../../lib/auth.js';
import clientPromise from '../../../../lib/mongodb.js';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return new Response(JSON.stringify({ valid: false }), { status: 400 });
  }

  const verified = verifyToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ valid: false }), { status: 401 });
  }

  if (verified.admin) {
    return new Response(JSON.stringify({ valid: true, user: verified }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const user = await db.collection('users').findOne({ _id: new ObjectId(verified.userId) });

    if (!user) {
      return new Response(JSON.stringify({ valid: false }), { status: 401 });
    }

    return new Response(JSON.stringify({
      valid: true,
      user: {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        credits: user.credits ?? 0,
        blocked: !!user.blocked,
      },
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ valid: false }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
