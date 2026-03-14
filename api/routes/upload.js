const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");


const upload = multer({
  dest: "uploads/",
});

const router = express.Router();
// const upload = multer({ dest: "/tmp" });

// ✅ create temp folder if not exists
const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ✅ use Windows-safe temp folder
// const upload = multer({ dest: tempDir });    //multer is a middleware used for handling file upload

// router.post("/", upload.single("photos"), async (req, res) => {
//   try {
//         if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       folder: "airbnb/places",
//     });

//     res.json({
//       url: result.secure_url,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

console.log("FILES:", req.files);



// router.post("/", upload.array("photos", 10), async (req, res) => {
//   try {
//     const uploadedImages = [];
   

//     for (const file of req.files) {
//       console.log("REQ.FILE:", req.file);
//       console.log("REQ.FILES:", req.files);

//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "Airbnb/Places",
//       });
      
//       uploadedImages.push(result.secure_url);
//     }

    

//     res.json(uploadedImages); // ✅ ARRAY of URLs
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Image upload failed" });
//   }
// });


// router.post("/upload", upload.array("photos", 10), adminAuth, async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ message: "No files uploaded" });
//     }

//     const uploadedImages = [];

//     for (const file of req.files) {
//       const result = await cloudinary.uploader.upload(file.path, {
//         folder: "Airbnb/Places",
//       });

//       // uploadedImages.push(result.secure_url);
//        uploadedImages.push({
//       url: result.secure_url,
//       public_id: result.public_id,
//       category: req.body.category
//       });
//     }

//     res.json(uploadedImages);
//   } catch (err) {
//     console.error("UPLOAD ERROR:", err);
//     res.status(500).json({ message: "Image upload failed" });
//   }
// });


// router.post("/upload", upload.array("photos", 10), adminAuth, async (req, res) => {
//   try {

//     const uploadedPhotos = [];

//     for (const file of req.files) {

//       const result = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "Airbnb/Places" },
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         );

//         stream.end(file.buffer);
//       });

//       uploadedPhotos.push({
//         url: result.secure_url,
//         public_id: result.public_id
//       });
//     }

//     res.json({
//       success: true,
//       photos: uploadedPhotos
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

module.exports = router;
