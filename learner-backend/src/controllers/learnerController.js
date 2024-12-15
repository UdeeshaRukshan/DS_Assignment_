const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Learner = require("../models/LearnerModel");
const Cart = require("../models/CartModel");
const {
  hashPassword,
  comparePassword,
  generateToken,
} = require("../middleware/auth");
const Enrollment = require("../models/EnrollmentModel");
const axios = require("axios");
const sendEmail=require('../../../supportbackend/src/utils/sendEmail')

// Function to create a new learner
exports.createLearner = async (req, res) => {
  try {
    const { name, email, password, description } = req.body;
    // Check if a learner with the provided email already exists
    const existingLearner = await Learner.findOne({ email });
    if (existingLearner) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // Hash the learner's password
    const hashedPassword = await hashPassword(password);
    // Create a new learner
    const newLearner = new Learner({
      name,
      email,
      password: hashedPassword,
      description,
    });
    // Save the new learner to the database
    await newLearner.save();

    res.status(201).json({ message: "Learner created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Save the new learner to the database
exports.learnerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find the learner by email
    const learner = await Learner.findOne({ email });
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }
    // Compare the provided password with the stored hashed password
    const passwordMatch = await comparePassword(password, learner.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Generate a JWT token for the learner
    const token = generateToken(learner);

    res.status(200).json({ token, learnerId: learner._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to view learner profile
exports.viewLearnerProfile = async (req, res) => {
  try {
    const learnerId = req.user.id;
    // Find the learner by ID
    const learner = await Learner.findById(learnerId);
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }
    res.status(200).json(learner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update learner profile
exports.updateLearnerProfile = async (req, res) => {
  try {
    const learnerId = req.user.id;
    const { name, description, password } = req.body;
    // Update the learner profile with the provided data
    const updatedLearner = await Learner.findByIdAndUpdate(
      learnerId,
      { name, description, password },
      { new: true }
    );

    if (!updatedLearner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    res.status(200).json({
      message: "Learner profile updated successfully",
      learner: updatedLearner,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // Make a request to the instructor service to get all courses
    const response = await axios.get(
      `http://localhost:8072/api/instructor/courses`
    );

    const courses = response.data;

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all learners
exports.getAllLearners = async (req, res) => {
  try {
    // Find all learners
    const learners = await Learner.find();
    res.status(200).json(learners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to enroll a learner in a course
exports.enrollCourse = async (req, res) => {
  try {
    const { learnerId, courseId } = req.body;
    // Create a new enrollment
    const enrollment = new Enrollment({
      learnerId,
      course: courseId,
    });
    // Save the enrollment to the database
    await enrollment.save();
    // Find the learner by ID to get the email address
    const response = await Learner.findById(learnerId);
    // Send an email notification about the enrollment
    sendEmail(
      response.email, // Assuming `email` field in ticket has the recipient's email
      "Course Enrolled",
      `You have successfully enrolled in a course.`
    );

    res.status(200).json({ message: "Course enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get enrollments by learner ID
exports.getEnrollmentsByLearnerId = async (req, res) => {
  try {
    const { learnerId } = req.params;
    // Find enrollments by learner ID
    const enrollments = await Enrollment.find({ learnerId });

    res.status(200).json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to unenroll a learner from a course
exports.unenrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const learnerId = req.user.id;
    // Delete the enrollment matching the learner ID and course ID
    await Enrollment.deleteOne({ learnerId, course: courseId });

    res.status(200).json({ message: "Unenrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to update course progress for a learner
exports.updateProgress = async (req, res) => {
  try {
    const { contentId, completed } = req.body;
    const learnerId = req.user.id;
    // Find the enrollment for the learner
    let enrollment = await Enrollment.findOne({ learnerId });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    // Update the progress for the specified content ID
    let progress = enrollment.progress.find(
      (item) => item.content_id === contentId
    );
    if (!progress) {
      enrollment.progress.push({ content_id: contentId, completed });
    } else {
      progress.completed = completed;
    }
    // Save the updated enrollment to the database
    await enrollment.save();

    res.status(200).json({ message: "Progress updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to delete a learner
exports.deleteLearner = async (req, res) => {
  try {
    const { learnerId } = req.params;
    // Find the learner by ID and delete
    await Learner.findByIdAndDelete(learnerId);

    res.status(200).json({ message: "Learner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get enrollment details by course ID and learner ID
exports.getEnrollmentByCourseIdAndLearnerId = async (req, res) => {
  try {
    const { courseId, learnerId } = req.params;
    // Find the enrollment by course ID and learner ID
    const enrollment = await Enrollment.findOne({
      course: courseId,
      learnerId: learnerId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const progressCount = enrollment.progress.length;

    console.log("Count" + progressCount);
    res.status(200).json({ enrollment, progressCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to add a course to the learner's cart
exports.addToCart = async (req, res) => {
  try {
    const { learnerId, courseId, title, description, price } = req.body;
    // Find the cart for the learner
    let cart = await Cart.findOne({ learnerId });

    if (!cart) {
      cart = new Cart({
        learnerId,
        courses: [],
        status: "pending",
      });
    }
    // Check if the course is already in the cart
    const existingCourseIndex = cart.courses.findIndex(
      (course) => course.courseId === courseId
    );

    if (existingCourseIndex !== -1) {
      return res.status(400).json({ message: "Course is already in the cart" });
    }
    // Add the new course to the cart
    cart.courses.push({
      courseId,
      title,
      description,
      price,
    });
    // Save the updated cart to the database
    await cart.save();

    res.status(200).json({ message: "Course added to cart successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to get all contents of the learner's cart
exports.getAllCartContents = async (req, res) => {
  try {
    const { learnerId } = req.params;
    // Find all cart contents for the learner
    const cartContents = await Cart.find({ learnerId });
    res.status(200).json(cartContents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Function to remove a course from the learner's cart
exports.removeCartContent = async (req, res) => {
  try {
    const { learnerId, courseId } = req.params;
    // Find the cart for the learner
    const cart = await Cart.findOne({ learnerId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    console.log("Cart before removal:", cart);
    // Remove the specified course from the cart
    cart.courses = cart.courses.filter(
      (course) => String(course.courseId) !== String(courseId)
    );
    // Save the updated cart to the database
    await cart.save();

    console.log("Cart after removal:", cart);

    res.status(200).json({ message: "Course removed from cart successfully" });
  } catch (error) {
    console.error("Error removing course from cart:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
