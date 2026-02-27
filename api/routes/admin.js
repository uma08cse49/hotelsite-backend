const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../utils/cloudinary");
const Place = require("../models/Place");


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


router.post("/upload/:id", upload.array("photos", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedPhotos = [];

    // for (const file of req.files) {
    //   const result = await cloudinary.uploader.upload(file.path);
    //   uploadedPhotos.push(result.secure_url);
    // }

    // for (const file of req.files) {
    //     const absolutePath = require("path").resolve(file.path);

    //     console.log("Uploading:", absolutePath);

    //     const result = await cloudinary.uploader.upload(absolutePath, {
    //         folder: "Airbnb/Places",
    //     });

    //     uploadedPhotos.push(result.secure_url);
    //     }
    

    const fs = require("fs");

        // for (const file of req.files) {
        // console.log("FILE OBJECT:", file);
        // console.log("FILE PATH:", file.path);
        // console.log("FILE EXISTS:", fs.existsSync(file.path));

        // const absolutePath = require("path").resolve(file.path);
        // console.log("ABSOLUTE PATH:", absolutePath);
        // console.log("ABS EXISTS:", fs.existsSync(absolutePath));

        // const result = await cloudinary.uploader.upload(absolutePath, {
        //     folder: "Airbnb/Places",
        // });

        // uploadedPhotos.push(result.secure_url);
        // }

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

            console.log("Cloudinary result:", result);

            }



    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    place.photos = [...(place.photos || []), ...uploadedPhotos];
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

router.delete("/place/:id", async (req, res) => {
  try {
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

router.put("/place/restore/:id", async (req, res) => {
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


router.get("/place/:id", async (req, res) => {
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
router.get("/places", async (req, res) => {
  try {
    const places = await Place.find(); // NO FILTER
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
