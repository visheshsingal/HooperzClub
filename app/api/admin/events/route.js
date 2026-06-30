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
    const events = await db.collection('events').find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify(events), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load events.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(request) {
  const token = parseBearerToken(request);
  const verified = verifyAdminToken(token);
  if (!verified) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    await db.collection('events').deleteOne({ id: eventId });
    await db.collection('joined').deleteMany({ eventId });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to delete event.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
