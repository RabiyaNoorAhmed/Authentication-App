const jwt = require("jsonwebtoken");
const userDB = require("../models/userSchema");
const keySecret = process.env.JWT_SECRET

// Middleware function for authentication
const authenticate = async (req, res, next) => {
    try {
        // Extract the token from the request headers
        const token = req.headers.authorization;

        // If no token is provided, return an error response
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }
        // Verify the token using the secret key
        const verifyToken = jwt.verify(token, keySecret);
        // console.log(verifyToken);
        // Find the user based on the ID stored in the verified token
        const rootUser = await userDB.findOne({ _id: verifyToken._id });
        // console.log(rootUser);
        // If no user is found with the ID from the token, throw an error
        if (!rootUser) {
            throw new Error("User not found");
        }

        // Attach token, rootUser object, and userID to the request object
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        // Call the next middleware function
        next();
    } catch (err) {
        // Handle any errors that occur during authentication
        res.status(401).json({ error: "Unauthorized: No token provided" });
        console.error(err);
    }
};

module.exports = authenticate;
