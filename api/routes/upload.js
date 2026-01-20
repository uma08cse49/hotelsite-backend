const express = require("express");
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const path = require("path");
const fs = require("fs");

const router = express.Router();
// const upload = multer({ dest: "/tmp" });

// ✅ create temp folder if not exists
const tempDir = path.join(__dirname, "../temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// ✅ use Windows-safe temp folder
const upload = multer({ dest: tempDir });

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


router.post("/", upload.array("photos", 10), async (req, res) => {
  try {
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "Airbnb/Places",
      });

      uploadedImages.push(result.secure_url);
    }

    res.json(uploadedImages); // ✅ ARRAY of URLs
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
