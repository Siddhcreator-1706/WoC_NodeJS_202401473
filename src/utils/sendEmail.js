const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: process.env.SMTP_PORT || 587,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Define the email options
    const message = {
        from: `${process.env.FROM_NAME || 'Support'} <${process.env.FROM_EMAIL || 'noreply@example.com'}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html // Optional: if you want to send HTML emails
    };

    // Send the email
    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);

    // Preview only available when sending through an Ethereal account
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('ethereal')) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
};

module.exports = sendEmail;
