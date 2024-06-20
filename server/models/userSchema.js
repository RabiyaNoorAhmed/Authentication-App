

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const keySecret = process.env.JWT_SECRET

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

// Hash Password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = this.password;
  }
  next();
});
// TOken Generate
userSchema.methods.generateAuthToken = async function () {
  try {
    let token1 = jwt.sign({ _id: this._id }, keySecret, {
      expiresIn: "1d"
    });

    this.tokens = this.tokens.concat({ token: token1 });
    await this.save();
    return token1
  } catch (error) {
    res.status(422).json(error)
  }
}
// Creating Model
const userDB = mongoose.model("users", userSchema);

module.exports = userDB;
