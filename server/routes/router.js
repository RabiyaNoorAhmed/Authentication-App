const express = require("express");
const userDB = require("../models/userSchema");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const authenticate = require("../middleware/auth");

// User Registration API
router.post("/register", async (req, res) => {
    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Please Fill All Details" });
    }

    try {
        const preUser = await userDB.findOne({ email });
        if (preUser) {
            return res.status(422).json({ error: "This Email is Already Exist" });
        } else if (password !== cpassword) {
            return res.status(422).json({ error: "Password and Confirm Password Do Not Match" });
        } else {
            const finalUser = new userDB({ fname, email, password, cpassword });

            // Password Hashing
            const storeData = await finalUser.save();
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

    if (!email || !password) {
        return res.status(422).json({ error: "Please Fill All Details" });
    }

    try {
        const userValid = await userDB.findOne({ email });

        if (!userValid) {
            return res.status(422).json({ error: "Invalid Details" });
        }

        const isMatch = await bcrypt.compare(password, userValid.password);

        if (!isMatch) {
            return res.status(422).json({ error: "Invalid Details" });
        }

        // Token Generate
        const token = await userValid.generateAuthToken();

        // Cookie Generate
        res.cookie("userCookie", token, {
            expires: new Date(Date.now() + 9000000),
            httpOnly: true,
        });

        const result = { userValid, token };

        res.status(201).json({ status: 201, result });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
        console.error("catch block Error", error);
    }
});

// Valid User API
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const ValidUserOne = await userDB.findOne({ _id: req.userID });
        res.status(201).json({ status: 201, ValidUserOne });
    } catch (error) {

        res.status(401).json({ status: 401, error });

    }

});

// User LogOut APi
router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((currElement) => {
            return currElement.token !== req.token
        });

        res.clearCookie("userCookie", { path: "/" });
        req.rootUser.save();
        res.status(201).json({status:201})
    } catch (error) {
        res.status(401).json({ status: 401,error })
    }
})

module.exports = router;
