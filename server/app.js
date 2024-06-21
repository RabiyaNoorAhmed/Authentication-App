const express  = require("express");
const app = express();
require("./db/connect");
const router = require("./routes/router");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const PORT = 8000;

// app.get("/",(req,res)=>{
//     res.status(201).json("Server Started")
// });
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(PORT,()=>{
    console.log(`Server is Running on: ${PORT} `);
})

