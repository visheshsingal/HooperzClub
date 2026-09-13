import bcrypt from 'bcryptjs';
import clientPromise from '../../../../lib/mongodb.js';
import { sendVerificationEmail } from '../../../../lib/mailer.js';

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: 'Name, email and password are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const client = await clientPromise;
    if (!client) {
      return new Response(JSON.stringify({ error: 'Database unavailable. Please try again later.' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const db = client.db('hooperzclub');
    const users = db.collection('users');

    const existingUser = await users.findOne({ email: normalizedEmail });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists.' }), { status: 409, headers: { 'Content-Type': 'application/json' } });
    }

    const otp = generateOtp();
    const hashedPassword = await bcrypt.hash(password, 12);
    const otpHash = await bcrypt.hash(otp, 10);

    const result = await users.insertOne({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      otpHash,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      credits: 99,
      blocked: false,
      profileCompleted: false,
      profile: {
        location: '',
        sport: '',
        bio: '',
        whatsapp: '',
        instagram: '',
        telegram: '',
      },
      createdAt: new Date(),
    });

    try {
      await sendVerificationEmail(normalizedEmail, otp, name);
    } catch (mailError) {
      await users.deleteOne({ _id: result.insertedId });
      console.error('Signup email verification failed:', mailError);
      return new Response(JSON.stringify({ error: 'Unable to send verification email. Please try again later.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Verification code sent to your email.', email: normalizedEmail }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
