const express = require("express");
const userDB = require("../models/userSchema");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/auth");

// User Registration API
router.post("/register", async (req, res) => {
    const { fname, email, password, cpassword } = req.body;

    // Check if all required fields are provided
    if (!fname || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Please Fill All Details" });
    }

    try {
        // Check if the email already exists in the database
        const preUser = await userDB.findOne({ email });
        if (preUser) {
            return res.status(422).json({ error: "This Email is Already Exist" });
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "Password and Confirm Password Do Not Match" });
        } else {
            // Create a new user document with hashed password
            const finalUser = new userDB({ fname, email, password, cpassword });

             // Password Hashing (pre-save hook in userSchema will hash the password)
            const storeData = await finalUser.save();  // Save the user document to the database
            res.status(201).json({ message: "User Registered Successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to Register" });
        console.error("catch block Error", error);
    }
});

// User Login API
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

// Check if email and password are provided
    if (!email || !password) {
        return res.status(422).json({ error: "Please Fill All Details" });
    }

    try {
        const userValid = await userDB.findOne({ email });
// Check if the user with the provided email exists
        if (!userValid) {
            return res.status(422).json({ error: "Invalid Details" });
        }
// Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, userValid.password);

        if (!isMatch) {
            return res.status(422).json({ error: "Invalid Details" });
        }

       // Generate JWT token for authentication
        const token = await userValid.generateAuthToken();

       // Set JWT token as a cookie in the response
        res.cookie("userCookie", token, {
            expires: new Date(Date.now() + 9000000),
            httpOnly: true, // Cookie accessible only by the server
        });

        const result = { userValid, token };

        res.status(201).json({ status: 201, result });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("catch block Error", error);
    }
});

// Valid User API (Protected Route)
router.get("/validuser", authenticate, async (req, res) => {
    try {
         // Fetch the validated user data using the userID from the authentication middleware
        const ValidUserOne = await userDB.findOne({ _id: req.userID });
        res.status(201).json({ status: 201, ValidUserOne });
    } catch (error) {

        res.status(401).json({ status: 401, error });

    }

});

// User Logout API (Protected Route)
router.get("/logout", authenticate, async (req, res) => {
    try {
        // Filter out the current token from the user's tokens array to logout
        req.rootUser.tokens = req.rootUser.tokens.filter((currElement) => {
            return currElement.token !== req.token
        });

        // Clear the userCookie token from the client's browser
        res.clearCookie("userCookie", { path: "/" });
        // Save the updated user document without the logged-out token
        req.rootUser.save();
        res.status(201).json({status:201})
    } catch (error) {
        res.status(401).json({ status: 401,error })
    }
})

module.exports = router;
