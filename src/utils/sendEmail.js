const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create a transporter
    // Safe debug logging: show length and partial characters to detect spaces or truncation
    const pass = process.env.SMTP_PASSWORD || '';
    const safePass = pass.length > 4
        ? `${pass.substring(0, 2)}...${pass.substring(pass.length - 2)} (len=${pass.length})`
        : (pass ? `[SHORT-PASS len=${pass.length}]` : 'Missing');

    console.log(`Debug Env: HOST=${process.env.SMTP_HOST || 'Missing'}, PORT=${process.env.SMTP_PORT}, USER=${process.env.SMTP_EMAIL || 'Missing'}, PASS=${safePass}`);

    // Explicitly casting port to number
    const port = Number(process.env.SMTP_PORT) || 587;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.ethereal.email',
        port: port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        },
        // Add debug options
        debug: true,
        logger: true
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
