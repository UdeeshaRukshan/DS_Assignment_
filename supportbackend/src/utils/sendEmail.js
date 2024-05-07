// Require Nodemailer
const nodemailer = require('nodemailer');

// Create a transporter object using SMTP
let transporter = nodemailer.createTransport({
    service: 'zoho',
    auth: {
        user: 'udeeshagamage12@zohomail.com',
        pass: 'Udee@#$%2003'
    }
});

// Create an email message
let mailOptions = {
    from: 'your_email@gmail.com',
    to: 'recipient_email@example.com',
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
