import { ObjectId } from 'mongodb';
import clientPromise from '../../../../lib/mongodb.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, profile } = body;

    if (!name) {
      return new Response(JSON.stringify({ error: 'Name is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const tokenHeader = request.headers.get('authorization') || '';
    const token = tokenHeader.replace('Bearer ', '');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Authentication required.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { verifyToken } = await import('../../../../lib/auth.js');
    const verified = verifyToken(token);
    if (!verified?.userId) {
      return new Response(JSON.stringify({ error: 'Invalid token.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(verified.userId) },
      {
        $set: {
          name,
          profileCompleted: true,
          profile: {
            location: profile?.location || '',
            sport: profile?.sport || '',
            bio: profile?.bio || '',
            whatsapp: profile?.whatsapp || '',
            instagram: profile?.instagram || '',
            telegram: profile?.telegram || '',
          },
        },
      },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return new Response(JSON.stringify({ error: 'User not found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save profile.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
