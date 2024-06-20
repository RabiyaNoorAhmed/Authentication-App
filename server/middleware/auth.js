const jwt = require("jsonwebtoken");
const userDB = require("../models/userSchema");
const keySecret = process.env.JWT_SECRET

const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const verifyToken = jwt.verify(token, keySecret);
        // console.log(verifyToken);
        const rootUser = await userDB.findOne({ _id: verifyToken._id });
        // console.log(rootUser);
        if (!rootUser) {
            throw new Error("User not found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
        console.error(err);
    }
};

module.exports = authenticate;
