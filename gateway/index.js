const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const httpProxy = require('http-proxy');
const dotenv = require('dotenv');

const app = express();
const proxy = httpProxy.createProxyServer();

require('dotenv').config();
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

const adminRoutes = ['/api/admin', '/api/admin/*'];
const instructorRoutes = ['/api/instructor', '/api/instructor/*'];
const learnerRoutes = ['/api/learner', '/api/learner/*'];

app.use((req, res, next) => {
    const { path } = req;

    if (adminRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8071' });
    } else if (instructorRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8072' });
    } else if (learnerRoutes.some(route => path.startsWith(route))) {
        proxy.web(req, res, { target: 'http://localhost:8073' });
    } else {
        res.status(404).send('Not Found');
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 8074;

app.listen(port, () => console.log(`Gateway up and running on port ${port}!`));
