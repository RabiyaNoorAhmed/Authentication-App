const mongoose = require("mongoose")
require('dotenv').config();
const DB = "mongodb+srv://rabiyanoorahmed:Karachi12@cluster0.wzc8rpr.mongodb.net/UserAuth?retryWrites=true&w=majority&appName=Cluster0"

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected")) // Success message if connection is established
  .catch(err => console.log(err)); // Error message if connection fails