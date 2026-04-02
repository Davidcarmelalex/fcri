import nodemailer from "nodemailer";

const MAIL_FROM = process.env.FCRI_MAIL_FROM || "FCRI <noreply@fcri.science>";

function canUseSmtp() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_HOST !== "smtp.example.com" &&
      process.env.SMTP_USER !== "example-user" &&
      process.env.SMTP_PASS !== "example-password",
  );
}

async function sendMail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}) {
  if (!canUseSmtp()) {
    return { delivered: false, reason: "smtp_not_configured" as const };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: MAIL_FROM,
    to,
    subject,
    text,
    html,
  });

  return { delivered: true as const };
}

export async function sendInquiryNotifications({
  name,
  email,
  organization,
  type,
  budget,
  message,
}: {
  name: string;
  email: string;
  organization?: string;
  type: string;
  budget?: string;
  message: string;
}) {
  const internalRecipient = process.env.FCRI_INBOX_EMAIL;
  const results = [];

  if (internalRecipient) {
    results.push(
      await sendMail({
        to: internalRecipient,
        subject: `[FCRI] New ${type} inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nOrganization: ${organization || "n/a"}\nType: ${type}\nBudget: ${budget || "n/a"}\n\n${message}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
            <h1>New FCRI Inquiry</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization || "n/a"}</p>
            <p><strong>Type:</strong> ${type}</p>
            <p><strong>Budget:</strong> ${budget || "n/a"}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>
        `,
      }),
    );
  }

  results.push(
    await sendMail({
      to: email,
      subject: "FCRI inquiry received",
      text: `Thank you ${name}. FCRI received your ${type} inquiry and will review it shortly.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
          <h1>FCRI inquiry received</h1>
          <p>Thank you ${name}.</p>
          <p>We received your ${type} inquiry and will review it shortly.</p>
          <p>Institutional context matters to us, so responses are handled with more care than generic support forms.</p>
        </div>
      `,
    }),
  );

  return results;
}
