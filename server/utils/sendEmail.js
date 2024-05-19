const emailjs = require('@emailjs/nodejs');

// Function to send an email using EmailJS
const sendEmail = async ({ email, reset_url }) => {
  try {
    const templateParams = {
      email,       // Recipient's email address
      reset_url,   // URL for password reset
    };

    // Debugging logs for environment variables (commented out for production)
    console.log('EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID);
    console.log('EMAILJS_TEMPLATE_ID:', process.env.EMAILJS_TEMPLATE_ID);
    console.log('EMAILJS_PUBLIC_KEY:', process.env.EMAILJS_PUBLIC_KEY);
    console.log('EMAILJS_PRIVATE_KEY:', process.env.EMAILJS_PRIVATE_KEY);

    // Send the email using EmailJS
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,   // EmailJS service ID
      process.env.EMAILJS_TEMPLATE_ID,  // EmailJS template ID
      templateParams,                   // Parameters to pass to the template
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY,     // Public API key
        privateKey: process.env.EMAILJS_PRIVATE_KEY,   // Private API key
      }
    );

    // Log success message
    console.log('Email sent successfully');
  } catch (error) {
    // Log error message and rethrow error
    console.error('Failed to send email:', error);
    throw error;
  }
};

module.exports = sendEmail;
