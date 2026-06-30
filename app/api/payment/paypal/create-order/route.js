export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD' } = body;

    if (typeof amount !== 'number' || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Amount must be a positive number.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !secret) {
      return new Response(JSON.stringify({ error: 'PayPal credentials are not configured.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const tokenResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      return new Response(JSON.stringify({ error: tokenData.error_description || 'Unable to authenticate with PayPal.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2),
            },
          },
        ],
      }),
    });

    const orderData = await orderResponse.json();
    if (!orderResponse.ok) {
      return new Response(JSON.stringify({ error: orderData.message || 'Unable to create PayPal order.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify(orderData), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Unable to create PayPal order.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
