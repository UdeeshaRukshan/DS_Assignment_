const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const admin = require('../models/AdminModel')