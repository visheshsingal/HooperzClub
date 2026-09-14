import nodemailer from 'nodemailer';

const appPassword = (process.env.EMAIL_APP_PASSWORD || '').trim().replace(/\s+/g, '');
const gmailUser = process.env.EMAIL_USER || 'thehooperzclub.contact@gmail.com';

const gmailTransporter = gmailUser && appPassword
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: appPassword,
      },
      logger: true,
      debug: true,
    })
  : null;

function buildHtml(otp, name = 'Player') {
  return `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background: #f5f5f5;">
      <div style="max-width: 620px; margin: 32px auto; background: #ffffff; border: 1px solid #e7e5e4; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);">
        <div style="background: linear-gradient(135deg, #111111 0%, #1f2937 100%); padding: 28px 32px;">
          <div style="font-size: 11px; letter-spacing: 0.26em; text-transform: uppercase; color: #fca5a5; font-weight: 800;">Hooperzclub</div>
        </div>

        <div style="padding: 32px 32px 28px; background: #fff;">
          <h1 style="margin: 0 0 12px; font-size: 30px; line-height: 1.2; color: #111111; font-weight: 800;">Verify your account</h1>
          <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.7; color: #52525b;">
            Hi ${name || 'Player'}, welcome to Hooperzclub. Use the code below to verify your email and unlock your dashboard.
          </p>

          <div style="margin: 24px 0; text-align: center; background: #111827; border-radius: 18px; padding: 22px 18px;">
            <div style="font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: #d4d4d8; font-weight: 700; margin-bottom: 10px;">Verification code</div>
            <div style="font-size: 34px; letter-spacing: 10px; color: #ffffff; font-weight: 800;">${otp}</div>
          </div>

          <p style="margin: 0 0 8px; font-size: 14px; line-height: 1.7; color: #52525b;">
            This code expires in 10 minutes. If you did not request this account verification, you can safely ignore this email.
          </p>
        </div>

        <div style="padding: 18px 32px 28px; background: #f8fafc; border-top: 1px solid #e7e5e4;">
          <p style="margin: 0; font-size: 12px; color: #71717a; text-align: center; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700;">
            Hooperzclub • Built for basketball communities
          </p>
        </div>
      </div>
    </div>
  `;
}

async function sendWithResend(email, otp, name = 'Player') {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'TheHooperzClub <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Hooperzclub verification code',
      html: buildHtml(otp, name),
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result?.message || 'Resend email send failed.');
  }

  return result;
}

export async function sendVerificationEmail(email, otp, name = 'Player') {
  if (!email || !otp) {
    throw new Error('Email and OTP are required.');
  }

  if (process.env.RESEND_API_KEY) {
    return sendWithResend(email, otp, name);
  }

  if (!gmailTransporter) {
    throw new Error('Email configuration error: Missing Gmail or Resend credentials.');
  }

  return gmailTransporter.sendMail({
    from: `Hooperzclub <${gmailUser}>`,
    to: email,
    subject: 'Your Hooperzclub verification code',
    html: buildHtml(otp, name),
  });
}
