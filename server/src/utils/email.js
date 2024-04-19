const nodemailer = require("nodemailer");
const ApiError = require("./ApiError");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const emailOptions = {
    from: "Vistas Voyage <vistas@voyage.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter
    .sendMail(emailOptions)
    .then((res) => console.log("Email sent successfully!"))
    .catch((err) => {
      throw new ApiError(500, "omething went wrong while sending email!");
    });
};

module.exports = sendEmail;
