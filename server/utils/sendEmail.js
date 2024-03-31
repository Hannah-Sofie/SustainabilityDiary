const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

// Configure transport options
const mailgunOptions = {
  auth: {
    api_key: "your-mailgun-api-key", // Replace with your Mailgun API key
    domain: "your-mailgun-domain", // Replace with your Mailgun domain
  },
};

const transport = nodemailer.createTransport(mailgunTransport(mailgunOptions));

const mailOptions = {
  from: "you@your-mailgun-domain", // Sender address
  to: "recipient@example.com", // List of recipients
  subject: "Password Reset", // Subject line
  text: "Here is your password reset link...", // Plain text body
  // html: '<p>Here is your password reset link...</p>', // HTML body
};

// Send email
transport.sendMail(mailOptions, function (err, info) {
  if (err) {
    console.error("Error sending email:", err);
  } else {
    console.log("Message sent:", info.messageId);
  }
});
