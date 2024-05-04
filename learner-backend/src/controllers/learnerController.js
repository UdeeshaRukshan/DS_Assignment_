const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const learner = require('../models/LearnerModel');
const enrollment = require('../models/EnrollmentModel');