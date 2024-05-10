const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');
const stripe = require('stripe')('pk_test_51PCn3w02viTsel8JLSMqJtAXz3N83i2SgnxOM5Fh0JO6Zj5EJ8qkdg729HjDV9Zu7OidTK6z2BelQtYPDC62RLFK00Y2BBI6gO');

const app = express();
const proxy = httpProxy.createProxyServer();

require('dotenv').config();
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const adminRoutes = ['/api/admin', '/api/admin/*'];
const instructorRoutes = ['/api/instructor', '/api/instructor/*'];
const learnerRoutes = ['/api/learner', '/api/learner/*'];
const SupportRoutes = ['/api/support', '/api/support/*'];


app.use((req, res, next) => {
    const { path } = req;

    if (adminRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8071' });
    } else if (instructorRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8072' });
    } else if (learnerRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8073' });
    }
    else if (learnerRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8074' });
    } else {
        res.status(404).send('Not Found');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
app.post('/api/payment', async (req, res) => {
    try {
      const { token } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1000, // Amount in cents
        currency: 'usd',
        payment_method: token,
        confirmation_method: 'manual',
        confirm: true,
      });
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Error processing payment.' });
    }
  });
const port = process.env.PORT || 8070;

app.listen(port, () => console.log(`Gateway up and running on port ${port}!`));
