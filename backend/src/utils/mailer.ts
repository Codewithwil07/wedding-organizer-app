import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465
  auth: {
    user: "youngrizch@gmail.com", // (dari .env)
    pass: "vhqruenrjbfuhtah", // (dari .env - 16 digit)
  },
});

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    await transporter.sendMail({
      from: "Churty Wedding Organizer",
      to: to, // email user
      subject: subject, // "Kode OTP Lo"
      text: text, // "Kode lo: 123456"
    });
    console.log('Email sent to', to);
  } catch (error) {
    console.error('Gagal kirim email:', error);
  }
};