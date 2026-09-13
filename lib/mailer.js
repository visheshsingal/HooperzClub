import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'thehooperzclub.contact@gmail.com',
    pass: process.env.EMAIL_APP_PASSWORD || 'qwfn fqzc xskj aeck',
  },
});

export async function sendVerificationEmail(email, otp, name = 'Player') {
  if (!email || !otp) {
    throw new Error('Email and OTP are required.');
  }

  await transporter.sendMail({
    from: `Hooperzclub <${process.env.EMAIL_USER || 'thehooperzclub.contact@gmail.com'}>`,
    to: email,
    subject: 'Your Hooperzclub verification code',
    html: `
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
    `,
  });
}
