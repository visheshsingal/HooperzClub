export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', receipt } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Amount must be a positive number.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) {
      return new Response(JSON.stringify({ error: 'Razorpay credentials are not configured.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1,
      }),
    });

    const data = await razorpayResponse.json();
    if (!razorpayResponse.ok) {
      return new Response(JSON.stringify({ error: data.error?.description || 'Unable to create Razorpay order.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to create payment order.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
