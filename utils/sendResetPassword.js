import nodemailer from "nodemailer";

const fromAddress = process.env.SMTP_FROM || "no-reply@example.com";

const transporter = nodemailer.createTransport({
  // If SMTP_SERVICE is set (e.g., "gmail"), Nodemailer will use it
  service: process.env.SMTP_SERVICE,
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // false for STARTTLS on 587
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  } : undefined
});

const sendResetPassword = async (email, resetURL) => {
  const subject = "Password Reset Request";
  const text = `You requested a password reset. Click the link to reset your password: ${resetURL}\nIf you did not request this, please ignore this email.`;
  const html = `<p>You requested a password reset.</p><p><a href="${resetURL}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject,
      text,
      html
    });
    return true;
  } catch (err) {
    console.error("Error sending reset email", err);
    // Fallback to console log so developer can still manually retrieve the link
    console.log(`Password reset link for ${email}: ${resetURL}`);
    return false;
  }
};

export default sendResetPassword;
