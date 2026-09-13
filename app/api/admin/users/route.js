import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb.js';
import { verifyAdminToken } from '../../../../lib/auth.js';

function parseBearerToken(request) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.replace('Bearer ', '').trim();
}

export async function GET(request) {
  const token = parseBearerToken(request);
  const verified = verifyAdminToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();
    const sanitized = users.map((user) => ({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      blocked: !!user.blocked,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    }));
    return new Response(JSON.stringify(sanitized), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load users.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PATCH(request) {
  const token = parseBearerToken(request);
  const verified = verifyAdminToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const body = await request.json();
    const { userId, blocked } = body;

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    if (blocked !== undefined && typeof blocked !== 'boolean') {
      return new Response(JSON.stringify({ error: 'blocked must be boolean.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const update = { $set: {} };
    if (blocked !== undefined) update.$set.blocked = blocked;

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      update,
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const user = result.value;
    return new Response(JSON.stringify({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      blocked: !!user.blocked,
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to update user.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
