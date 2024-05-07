const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const learner = require('./routes/learnerRoutes');
const tickerRouter=require('./routes/TicketRoutes');
const app = express();
require('dotenv').config();
const cors = require('cors');
const {sendActivationEmail}=require('./utils/sendEmail');
const userEmailAddress = 'user@example.com';
const activationToken = 'some-unique-token-for-activation';
const resetToken = 'some-unique-token-for-password-reset';

// Generate activation and reset links (assuming your app uses query parameters for tokens)
const activationLink = `http://yourdomain.com/activate?token=${activationToken}`;
const resetLink = `http://yourdomain.com/reset-password?token=${resetToken}`;

// Send an activation email
sendActivationEmail(userEmailAddress, activationLink);

app.use(cors(
    {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const db = process.env.MONGODB_URI;

mongoose
    .connect('mongodb+srv://rukshan:rukshan123@cluster0.w9lemr4.mongodb.net/AssignmentAF?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log(err));

// Routes
// app.use('/api/learner', learner);

app.use('/api', tickerRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8073;

app.listen(port, () => console.log(`Server up and running on port ${port}!`));
