import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb.js';
import { verifyToken } from '../../../../lib/auth.js';

function parseBearerToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
}

export async function POST(request) {
  try {
    const token = parseBearerToken(request);
    const verified = verifyToken(token);
    if (!verified || verified.admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const body = await request.json();
    const { amount } = body;

    if (typeof amount !== 'number' || !Number.isInteger(amount) || amount === 0) {
      return new Response(JSON.stringify({ error: 'Amount must be a non-zero integer.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const user = await db.collection('users').findOne({ _id: new ObjectId(verified.userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const currentCredits = user.credits ?? 0;
    const nextCredits = currentCredits + amount;
    if (nextCredits < 0) {
      return new Response(JSON.stringify({ error: 'Insufficient credits.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(verified.userId) },
      { $set: { credits: nextCredits } }
    );

    return new Response(JSON.stringify({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      credits: nextCredits,
      blocked: !!user.blocked,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to update credits.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function GET(request) {
  try {
    const token = parseBearerToken(request);
    const verified = verifyToken(token);
    if (!verified || verified.admin) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const user = await db.collection('users').findOne({ _id: new ObjectId(verified.userId) });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      credits: user.credits ?? 0,
      blocked: !!user.blocked,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load credits.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
