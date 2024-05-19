import emailjs from 'emailjs-com';

const sendEmail = async (templateParams) => {
  try {
    const response = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_PUBLIC_KEY
    );
    ('Email sent successfully:', response.status, response.text);
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
