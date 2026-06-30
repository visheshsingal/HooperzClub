import clientPromise from '../../../../lib/mongodb.js';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const events = await db.collection('events').find({}).sort({ createdAt: -1 }).toArray();
    return new Response(JSON.stringify(events), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load events.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      sport,
      type,
      teams,
      start,
      location,
      fee,
      description,
      fixtureType,
      fixtureTitle,
      fixtures,
      createdBy,
    } = body;

    if (!id || !name) {
      return new Response(JSON.stringify({ error: 'Event id and name are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const event = {
      id,
      name,
      sport,
      type,
      teams,
      start,
      location,
      fee,
      description,
      fixtureType,
      fixtureTitle,
      fixtures: fixtures ?? [],
      createdBy,
      createdAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    await db.collection('events').insertOne(event);

    return new Response(JSON.stringify(event), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to save event.' }), {
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
    await db.collection('events').deleteOne({ id: eventId });
    await db.collection('joined').deleteMany({ eventId });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to delete event.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
