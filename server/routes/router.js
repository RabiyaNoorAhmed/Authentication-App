const express = require("express");
const authenticate = require("../middleware/auth");
const {
    registerUser,
    loginUser,
    validUser,
    logoutUser
} = require("../controllers/userController");

const router = new express.Router();

// User Registration API
router.post("/register", registerUser);

// User Login API
router.post("/login", loginUser);

// Valid User API (Protected Route)
router.get("/validuser", authenticate, validUser);

// User Logout API (Protected Route)
router.get("/logout", authenticate, logoutUser);

module.exports = router;
