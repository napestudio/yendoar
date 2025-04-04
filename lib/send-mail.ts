import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
  logger: true, // <-- Agregá esto
  debug: true,
});

export const sendEmail = async (
  buyer: string,
  subject: string,
  html: string,
  attachments: any
) => {
  const mailOptions: any = {
    from: process.env.EMAIL,
    to: [buyer, process.env.EMAIL],
    subject,
    html,
    attachments,
    attachDataUrls: true,
  };

  await transporter.sendMail(mailOptions);
  return true;
};
