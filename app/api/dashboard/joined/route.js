import clientPromise from '../../../../lib/mongodb.js';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const joined = await db.collection('joined').find({}).sort({ joinedAt: -1 }).toArray();
    return new Response(JSON.stringify(joined), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load joined entries.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { eventId, teamId, teamName, teamSport } = body;

    if (!eventId || !teamId || !teamName || !teamSport) {
      return new Response(JSON.stringify({ error: 'eventId, teamId, teamName and teamSport are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const joined = {
      eventId,
      teamId,
      teamName,
      teamSport,
      joinedAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    await db.collection('joined').insertOne(joined);

    return new Response(JSON.stringify(joined), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save joined entry.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return new Response(JSON.stringify({ error: 'eventId is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const latest = await db.collection('joined').find({ eventId }).sort({ joinedAt: -1 }).limit(1).toArray();

    if (latest.length === 0) {
      return new Response(JSON.stringify({ error: 'No joined application found.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.collection('joined').deleteOne({ _id: latest[0]._id });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to delete joined entry.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
