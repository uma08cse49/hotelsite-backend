import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

console.log("MIDDLEWARE SECRET:", JWT_SECRET);


export const adminAuth = (req, res, next) => {
  // const token = req.headers.authorization?.split(" ")[1];
  // console.log("TOKEN RECEIVED:", token);

  // if (!token) {
  //   return res.status(401).json({ message: "No token" });
  // }

  // try {
  //   const decoded = jwt.verify(token, JWT_SECRET);
  //   req.admin = decoded;
  //   next();
  // } catch (err) {
  //   res.status(401).json({ message: "Invalid token" });
  // }


  const authHeader = req.headers.authorization;

if (!authHeader) {
  return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split(" ")[1];

if (!token) {
  return res.status(401).json({ message: "Invalid token" });
}

jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  if (err) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.adminId = decoded.id;
  next();
});
};

// export const adminAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "No token" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.adminId = decoded.id;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };