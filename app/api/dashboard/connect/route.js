import clientPromise from '../../../../lib/mongodb.js';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const users = await db.collection('users').find({
      'profile.sport': { $exists: true, $ne: '' },
      'profile.location': { $exists: true, $ne: '' }
    }).project({
      password: 0,
    }).toArray();

    const mappedUsers = users.map((user) => ({
      userId: user._id.toString(),
      name: user.name,
      profile: user.profile || {
        location: '',
        sport: '',
        bio: '',
        whatsapp: '',
        instagram: '',
        telegram: '',
      },
    }));

    return new Response(JSON.stringify({ users: mappedUsers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to load connect data.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
