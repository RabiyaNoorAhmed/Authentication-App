

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const keySecret = process.env.JWT_SECRET

// Define the user schema using Mongoose
const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error("Not Valid Email");
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  cpassword: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

// Hash Password before saving to database
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12); // Hash the password with bcryptjs
    this.cpassword = this.password; // Store the hashed password in cpassword field (if needed)
  }
  next();
});
// Generate JWT token for authentication
userSchema.methods.generateAuthToken = async function () {
  try {
    let token1 = jwt.sign({ _id: this._id }, keySecret, {
      expiresIn: "1d" // Token expires in 1 day
    });

    this.tokens = this.tokens.concat({ token: token1 }); // Add generated token to tokens array
    await this.save(); // Save the updated user document
    return token1 // Return the generated token
  } catch (error) {
    res.status(422).json(error)  // Throw an error if token generation fails
  }
}
// Create a Mongoose model based on userSchema
const userDB = mongoose.model("users", userSchema);

module.exports = userDB;
