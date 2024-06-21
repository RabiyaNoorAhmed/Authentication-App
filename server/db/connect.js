const mongoose = require("mongoose")
require('dotenv').config();

// Connect to MongoDB using mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected")) 
  .catch(err => console.log(err)); 