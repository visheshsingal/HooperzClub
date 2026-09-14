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
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #fff; color: #111; border: 1px solid #e4e4e7; border-radius: 16px;">
      <div style="font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: #dc2626; font-weight: 700; margin-bottom: 20px;">Hooperzclub</div>
      <h2 style="margin: 0 0 12px; font-size: 28px;">Verify your email</h2>
      <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #3f3f46;">
        Hi ${name || 'Player'}, your verification code is below. Enter it in the app to activate your account.
      </p>
      <div style="display: inline-block; padding: 20px 28px; background: #111827; color: #ffffff; border-radius: 12px; font-size: 32px; letter-spacing: 8px; font-weight: 700;">
        ${otp}
      </div>
      <p style="margin-top: 24px; font-size: 14px; color: #52525b; line-height: 1.6;">
        This code expires in 10 minutes. If you did not request this, please ignore this email.
      </p>
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
