const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Retrieve the secret key from environment variables
const SECRET_KEY = process.env.SECRET_KEY;

// Function to hash a password using bcrypt
exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Function to compare a password with its hashed version
exports.comparePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

// Function to generate a JWT token for a user
exports.generateToken = (user) => {
  const payload = {
    id: user._id,
    username: user.email,
    role: user.userType,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "6h" });
  return token;
};

// Function to verify the authenticity of a JWT token
exports.verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err) {
    return null;
  }
};

// Middleware function to authenticate requests using JWT tokens
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).send("Access Denied");
  }
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    console.log("Verified user:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid Token");
  }
};
