const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      Secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.MY_EMAIL, // my email
      to: email,
      subject,
      text
    });
  } catch (err) {
    // console.log(`Error transporter: ${err}`);
  }
};
