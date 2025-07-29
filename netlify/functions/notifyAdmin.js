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

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.NOTIFY_EMAIL, // your own email address
      subject: 'New Visitor Notification',
      text: `A new visitor submitted their info:\n\nName: ${firstName} ${lastName || ''}\nEmail: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Admin notified of new visitor.' }),
    };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Failed to notify admin' }),
    };
  }
};
