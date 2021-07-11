require("dotenv").config();
const nodemailer = require("nodemailer");
async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  let info = await transporter.sendMail(
    {
      from: `fileEasy <${from}>`,
      to,
      subject,
      text,
      html,
    },
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Email Sent");
      }
    }
  );
}
module.exports = sendMail;
