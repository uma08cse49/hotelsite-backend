const express = require("express");
// import express from "express";
// const router = express.Router();
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Place = require("../models/Place");
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import Admin from "../models/Admin.js";
// import { adminAuth } from "../middlewares/adminAuth.js";
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
// const User = require("../models/users");
const User = require("../models/User");
const { adminAuth } = require("../middlewares/adminAuth");

const JWT_SECRET = process.env.JWT_SECRET;

const upload = multer({ storage: multer.memoryStorage() });
const path = require("path");

// const absolutePath = path.resolve(file.path);
// // Upload images to a place
// router.post("/upload/:id", upload.array("photos"), async (req, res) => {
//   try {
//     const placeId = req.params.id;

//     const uploadedPhotos = [];

//     for (const file of req.files) {
//       const result = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           {
//             folder: "Airbnb/AdminUploads",
//           },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(file.buffer);
//       });

//       uploadedPhotos.push(result.secure_url);
//     }

//     const place = await Place.findByIdAndUpdate(
//       placeId,
//       { $push: { photos: { $each: uploadedPhotos } } },
//       { new: true }
//     );

//     res.json(place);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });



// router.post("/upload/:id", upload.array("photos", 10), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     const uploadedPhotos = [];

//     for (const file of req.files) {
//       const result = await cloudinary.uploader.upload(file.path);
//       uploadedPhotos.push(result.secure_url);
//     }
    

//     const place = await Place.findById(req.params.id);
//     if (!place) {
//         return res.status(404).json({ message: "Place not found" });
//         }
//     place.photos = [...(place.photos || []), ...uploadedPhotos];
    
//     await place.save();
//     console.log("PARAM ID:", req.params.id);
    


//     res.json({ success: true, photos: place.photos });

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: error.message });
//   }
// });


router.get("/test", (req, res) => {
  console.log("ADMIN TEST ROUTE HIT");
  res.json({ message: "Admin working" });
});



// LOGIN
// router.post("/login",async (req, res) => {
//   try {

//     console.log("ADMIN FOUND:", admin);

//     const { email, password } = req.body;

//     console.log("Email from request:", email);

//     const admin = await Admin.findOne({ email });

//     console.log("Admin from DB:", admin);
    

//     console.log("Entered password:", password);
//     console.log("Stored password:", admin.password);
//     console.log("Type of stored password:", typeof admin.password);

//     if (!admin) {
//       return res.status(400).json({ message: "Invalid username" });
//     }

   

//     const isMatch = await bcrypt.compare(password, admin.password);

//     console.log("LOGIN ROUTE HIT");
//     console.log("BODY:", req.body);
//     console.log("is Match",isMatch)

//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid password" });
//     }

//     // const token = jwt.sign(
//     //   { id: admin._id, username: admin.username },
//     //   JWT_SECRET,
//     //   { expiresIn: "1d" }
//     // );

//     const token = jwt.sign(
//       { id: admin._id },
//       JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


router.post("/login", async (req, res) => {
  try {

    console.log("LOGIN SECRET:", process.env.JWT_SECRET);
    const { email, password } = req.body;

    const admin = await User.findOne({ email, isAdmin: true });

    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/upload/:id", upload.array("photos", 10),adminAuth, async (req, res) => {

  console.log("Upload route Hit.....")
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedPhotos = [];

    const fs = require("fs");

        for (const file of req.files) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                { folder: "Airbnb/Places" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
                );

                stream.end(file.buffer);
            });

            uploadedPhotos.push(
              { url: result.secure_url,
                public_id: result.public_id 
              });
            console.log("Uploaded files:", req.files);
            console.log("Cloudinary result:", result);

            }

    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

  //     place.photos = [
  //   ...(place.photos || []).filter(p => typeof p === "object"),
  //   ...uploadedPhotos
  // ];
  

  // delete old images
    for (const photo of place.photos) {
      if (photo.public_id) {
        await cloudinary.uploader.destroy(photo.public_id);
      }
}

    // place.photos = [...(place.photos || []), ...uploadedPhotos];

    // Replace old photos
    place.photos = uploadedPhotos;

    await place.save();
    console.log("FILES:", req.files);

    res.json({ success: true, photos: place.photos });

  } catch (error) {
    console.log("ADMIN UPLOAD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// router.delete("/admin/place/:id", async (req, res) => {
//   try {
//     await Place.findByIdAndDelete(req.params.id);
//     res.json({ message: "Place deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.delete("/place/:id", adminAuth,async (req, res) => {
  try {
    console.log("Delete function triggered...")
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // 🔥 Delete images from Cloudinary
    for (const photo of place.photos) {
      console.log("Deleting public_id:", photo.public_id);
      if (photo.public_id) {
       const result= await cloudinary.uploader.destroy(photo.public_id);
       console.log("Cloudinary result:", result);
      }
    }

    // 🔥 Soft delete
    place.isDeleted = true;
    await place.save();

    res.json({ message: "Place soft deleted successfully" });

  } catch (err) {
    console.log("Cloudinary result:", result);
    res.status(500).json({ error: err.message });
  }
});

router.put("/place/restore/:id",adminAuth, async (req, res) => {

  console.log("restore function triggered...")
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    place.isDeleted = false;
    await place.save();

    res.json({ message: "Place restored successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/place/:id",adminAuth, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id); // no isDeleted filter

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ place });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/places", async (req, res) => {
//   const places = await Place.find(); // no filter here
//   res.json(places);
// });
router.get("/places",adminAuth, async (req, res) => {
  try {
    const places = await Place.find(); // NO FILTER
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// router.get("/places", adminAuth, async (req, res) => {
//   const places = await Place.find();
//   res.json(places);
// });



router.post("/remove-photo/:id", async (req, res) => {

  const { photo } = req.body;
  const place = await Place.findById(req.params.id);

  if (!place) return res.status(404).json({ message: "Place not found" });

  if (photo?.public_id) {
    await cloudinary.uploader.destroy(photo.public_id);
  }

  place.photos = [];
  await place.save();

  res.json({ success: true });

});



module.exports = router;
