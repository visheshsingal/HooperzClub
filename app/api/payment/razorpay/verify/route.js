import crypto from 'crypto';
import clientPromise from '../../../../../lib/mongodb.js';

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      eventId,
      teamId,
      teamName,
      teamSport,
    } = body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !eventId || !teamId || !teamName || !teamSport) {
      return new Response(JSON.stringify({ error: 'Missing payment or application details.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay secret is not configured.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: 'Payment verification failed.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const joined = {
      eventId,
      teamId,
      teamName,
      teamSport,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      joinedAt: new Date().toISOString(),
    };

    const client = await clientPromise;
    const db = client.db('hooperzclub');
    const result = await db.collection('joined').insertOne(joined);

    return new Response(JSON.stringify({
      _id: result.insertedId.toString(),
      ...joined,
    }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to verify payment.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
