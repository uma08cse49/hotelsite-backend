const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Checks user is logged in based on passed token and set the user in request
// exports.isLoggedIn = async (req, res, next) => {
//     // token could be found in request cookies or in reqest headers
//     const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Login first to access this page',
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = await User.findById(decoded.id);
//         next();
//         console.log("SECRET:", process.env.JWT_SECRET);
//     } catch (error) {
//         // Handle JWT verification error
//         console.error('JWT verification error:', error);
//         return res.status(401).json({
//             success: false,
//             message: 'Invalid token',
//         });
//     }
// };


exports.isLoggedIn = (req, res, next) => {
  try {
    let token = null;

    // 1. From cookies
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // 2. From Authorization header
    else if (req.headers.authorization) {
      token = req.headers.authorization.replace('Bearer ', '');
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({ error: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};