// import bcrypt from "bcryptjs";
// import User from "../models/User.js";


// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const express = require("express");
// const router = express.Router();

// router.post("/register", async (req,res)=>{

//  const {name,email,password} = req.body;

//  const hashedPassword = await bcrypt.hash(password,10);

//  const user = await User.create({
//    name,
//    email,
//    password:hashedPassword,
//    provider:"email"
//  });

//  res.json(user);

// });


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {

    console.log("REGISTER HIT");
    
  try {

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Create JWT
    const token = user.getJwtToken();

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });

  } catch (error) {
    console.log("REGISTER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});


// login route For user login

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json(
        { 
          message: "Invalid credentials" 
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // return res.status(400).json({ message: "Invalid credentials" });
      return res.status(400).json({
      success: false,
      message: "Invalid credentials"
    });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // res.json({
    //   token,
    //   user: {
    //     id: user._id,
    //     name: user.name,
    //     email: user.email,
    //     picture: user.picture,
    //     isAdmin: user.isAdmin
    //   }
    // });

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        isAdmin: user.isAdmin
      }
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 