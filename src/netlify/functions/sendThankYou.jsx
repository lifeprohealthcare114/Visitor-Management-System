// netlify/functions/sendThankYou.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  try {
    // Parse JSON body
    const { email, firstName, lastName } = JSON.parse(event.body);

    if (!email || !firstName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: email or firstName' }),
      };
    }

    // Create reusable transporter object using Gmail SMTP
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.GMAIL_USER,     // Your full Gmail address
        pass: process.env.GMAIL_APP_PASS, // Use Gmail App Password here
      },
    });

    // Compose email message
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Thank You for Visiting Us!',
      text: `Dear ${firstName} ${lastName || ''},\n\nThank you for your visit. We appreciate your time.\n\nBest regards,\nLifepro Healthcare Team`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Thank you email sent successfully.' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to send email' }),
    };
  }
};
