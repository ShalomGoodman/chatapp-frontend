/* eslint-disable */
export default function (req, res) {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    secure: "true",
    auth: {
      user: "shalomgoodman8@gmail.com",
      pass: process.env.GMAIL_PASSWORD
    },
  });

  const mailData = {
    from: "The Shluchim Office",
    to: req.body.email,
    subject: `Shluchim Online School - Chatapp Verification Email`,
    text: req.body.message,
  };
  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: `an error occurred ${err}` });
    }
    res.status(200).json({ message: info });
  });
}
