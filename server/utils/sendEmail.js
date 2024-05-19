const emailjs = require('@emailjs/nodejs');

const sendEmail = async ({ email, reset_url }) => {
  try {
    const templateParams = {
      email,
      reset_url,
    };

    ('EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID);
    ('EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID);
    ('EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY);
    ('EMAILJS_PRIVATE_KEY:', process.env.EMAILJS_PRIVATE_KEY);

    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID,
      templateParams,
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,
        privateKey: process.env.EMAILJS_PRIVATE_KEY, // Add private key here
      }
    );

    ('Email sent successfully');
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

module.exports = sendEmail;
