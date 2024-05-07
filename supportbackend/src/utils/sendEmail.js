// nodemailerSetup.js

const nodemailer = require('nodemailer');

function sendTestEmail() {
    // Create a transporter object using SMTP
    let transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        secure: true,
        port: 465,
        auth: {
            user: 'udeeshagamage12@zohomail.com',
            pass: 'r731EzXLULg1'
        }
    });

    // Create an email message
    let mailOptions = {
        from: 'udeeshagamage12@zohomail.com',
        to: 'udeeshagamage12@gmail.com',
        subject: 'Test Email',
        text: 'This is a test email sent from Node.js using Nodemailer.'
    };

    // Send the email
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = sendTestEmail;
