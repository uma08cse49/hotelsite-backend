// // require("dotenv").config({ path: "../.env" });


// const mongoose = require("mongoose");
// const fs = require("fs");
// const path = require("path");
// const cloudinary = require("../utils/cloudinary");
// const Place = require("../models/Place");

// require("dotenv").config({
//   path: path.join(__dirname, "../.env"),
// });

// // 🔹 CONNECT DB
// async function connectDB() {
//     if (!process.env.MONGO_URL) {
//     console.error("❌ MONGO_URI not found");
//     process.exit(1);
//     }

//   await mongoose.connect(process.env.MONGO_URL);
//   console.log("✅ MongoDB connected");
// }

// // 🔹 IMAGE ROOT
// const HOTELS_DIR = path.join(__dirname, "../images/hotels");

// async function seedHotels() {
//   await connectDB();

//   if (!fs.existsSync(HOTELS_DIR)) {
//     console.log("❌ hotels image folder not found");
//     process.exit(1);
//   }

//   const hotelFolders = fs.readdirSync(HOTELS_DIR);

//   for (const hotelSlug of hotelFolders) {
//     const hotelPath = path.join(HOTELS_DIR, hotelSlug);

//     if (!fs.statSync(hotelPath).isDirectory()) continue;

//     // 🔐 PREVENT DUPLICATES
//     const existingHotel = await Place.findOne({ slug: hotelSlug });
//     if (existingHotel) {
//       console.log(`⏭️  Skipped (already exists): ${hotelSlug}`);
//       continue;
//     }

//     console.log(`🏨 Seeding hotel: ${hotelSlug}`);

//     const imageFiles = fs.readdirSync(hotelPath);
//     const uploadedImages = [];

//     for (const img of imageFiles) {
//       const imgPath = path.join(hotelPath, img);

//       const result = await cloudinary.uploader.upload(imgPath, {
//         folder: `Airbnb/Places/${hotelSlug}`,
//       });

//       uploadedImages.push(result.secure_url);
//     }

//     // 🏗 CREATE HOTEL
//     await Place.create({
//       title: hotelSlug.replace(/-/g, " ").toUpperCase(),
//       slug: hotelSlug,
//       address: "India",
//       photos: uploadedImages,
//       price: 2500,
//       description: "Seeded hotel",
//       maxGuests: 4,
//     });

//     console.log(`✅ Created: ${hotelSlug}`);
//   }

//   console.log("\n🎉 Hotel seeding completed");
//   process.exit();
// }

// seedHotels();


// require("dotenv").config({ path: "../.env" });
// const path = require("path");

// // 1️⃣ Load env FIRST
// require("dotenv").config({
//   path: path.join(__dirname, "../.env"),
// });

// const mongoose = require("mongoose");
// const fs = require("fs");
// const cloudinary = require("../utils/cloudinary");
// const Place = require("../models/Place");

// mongoose.set("strictQuery", false);
// mongoose.connect(process.env.MONGO_URL);

// async function uploadImagesForHotel() {
//   try {
//     const hotelTitle = "casonova";
//     const hotelSlug = "casonova";
//     const imageDir = path.join(__dirname, "../images/hotels/casonova");

//     console.log("📂 Reading images from:", imageDir);

//     const place = await Place.findOne({ title: hotelTitle });

//     if (!place) {
//       throw new Error("Place not found in DB");
//     }

//     const files = fs.readdirSync(imageDir);
//     console.log("🖼️ Files found:", files);

//     const uploadedPhotos = [];

//     for (const file of files) {
//       const filePath = path.join(imageDir, file);
//       console.log("⬆ Uploading:", filePath);

//       const result = await cloudinary.uploader.upload(filePath, {
//         folder: `Airbnb/Places/${hotelSlug}`,
//       });

//       uploadedPhotos.push(result.secure_url);
//     }

//     place.photos = uploadedPhotos;
//     await place.save();

//     console.log("✅ Images linked to place:", hotelTitle);
//     process.exit(0);

//   } catch (err) {
//     console.error("❌ SCRIPT FAILED");
//     console.error(err);               // 👈 THIS IS THE KEY
//     console.error(err?.message);
//     console.error(err?.error);
//     process.exit(1);
//   }
// }

// uploadImagesForHotel().catch(err => {
//   console.error("❌ Unhandled error:", err);
//   process.exit(1);
// });



// const path = require("path");
// require("dotenv").config({
//   path: path.join(__dirname, "../.env"),
// });

// const mongoose = require("mongoose");
// const fs = require("fs");
// const cloudinary = require("../utils/cloudinary");
// const Place = require("../models/Place");

// mongoose.set("strictQuery", false);
// mongoose.connect(process.env.MONGO_URL);

// // Convert slug to title
// function slugToTitle(slug) {
//   return slug
//     .split("-")
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// }

// async function seedHotels() {
//   try {
//     const hotelsDir = path.join(__dirname, "../images/hotels");
//     const hotelFolders = fs.readdirSync(hotelsDir);

//     for (const folder of hotelFolders) {
//       const hotelSlug = folder;
//       const hotelTitle = slugToTitle(folder);

//       console.log(`\n🏨 Processing: ${hotelTitle}`);

//       const imageDir = path.join(hotelsDir, folder);
//       const files = fs.readdirSync(imageDir);

//       let place = await Place.findOne({ title: hotelTitle });

//       if (!place) {
//         console.log("➕ Creating new place...");
//         place = await Place.create({
//           title: hotelTitle,
//           address: "India",
//           description: `${hotelTitle} description`,
//           price: 3000,
//           photos: [],
//         });
//       }

//       const uploadedPhotos = [];

//       for (const file of files) {
//         const filePath = path.join(imageDir, file);

//         const stats = fs.statSync(filePath);
//         if (stats.size > 10 * 1024 * 1024) {
//           console.log("⏭ Skipping large file:", file);
//           continue;
//         }

//         console.log("⬆ Uploading:", file);

//         const result = await cloudinary.uploader.upload(filePath, {
//           folder: `Airbnb/Places/${hotelSlug}`,
//           quality: "auto",
//           fetch_format: "auto",
//         });

//         uploadedPhotos.push(result.secure_url);
//       }

//       place.photos = uploadedPhotos;
//       await place.save();

//       console.log(`✅ Finished ${hotelTitle}`);
//     }

//     console.log("\n🎉 All hotels processed!");
//     process.exit(0);

//   } catch (err) {
//     console.error("❌ Error:", err);
//     process.exit(1);
//   }
// }

// seedHotels();



const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const mongoose = require("mongoose");
const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const cloudinary = require("../utils/cloudinary");
const Place = require("../models/Place");

mongoose.connect(process.env.MONGO_URL);

function slugToTitle(slug) {
  return slug
    .split("-")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function generateHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

async function resizeImage(inputPath) {
  const outputPath = inputPath + "-optimized.jpg";

  await sharp(inputPath)
    .resize({ width: 2000 })
    .jpeg({ quality: 85 })
    .toFile(outputPath);

  return outputPath;
}

async function seedHotels() {
  const hotelsDir = path.join(__dirname, "../images/hotels");
  const hotelFolders = fs.readdirSync(hotelsDir);

  for (const folder of hotelFolders) {
    const slug = folder;
    const title = slugToTitle(folder);

    console.log(`\n🏨 Processing: ${title}`);

    const imageDir = path.join(hotelsDir, folder);
    const files = fs.readdirSync(imageDir);

    let place = await Place.findOne({ title });

    if (!place) {
      place = await Place.create({
        title,
        address: "India",
        description: `${title} description`,
        price: 3000,
        photos: [],
      });
    }

    const localHashes = [];

    for (const file of files) {
      const filePath = path.join(imageDir, file);
      const hash = generateHash(filePath);
      localHashes.push(hash);

      const exists = place.photos.find(p => p.hash === hash);

      if (exists) {
        console.log("⏭ No change:", file);
        continue;
      }

      console.log("⬆ Processing & Uploading:", file);

      const optimizedPath = await resizeImage(filePath);

      const result = await cloudinary.uploader.upload(optimizedPath, {
        folder: `Airbnb/Places/${slug}`,
        public_id: hash,
        overwrite: true,
      });

      place.photos.push({
        url: result.secure_url,
        hash,
        public_id: result.public_id,
      });

      fs.unlinkSync(optimizedPath);
    }

  //   // Sync deletions
  //   for (const photo of place.photos) {
  //     if (!localHashes.includes(photo.hash)) {
  //       console.log("🗑 Removing deleted image:", photo.public_id);

  //       await cloudinary.uploader.destroy(photo.public_id);

  //       place.photos = place.photos.filter(p => p.hash !== photo.hash);
  //     }
  //   }

  //   if (!place.coverPhoto && place.photos.length > 0) {
  //     place.coverPhoto = place.photos[0].url;
  //   }

  //   await place.save();
  //   console.log(`✅ Synced ${title}`);
  // }

  for (const photo of place.photos) {
  if (!photo.hash || !photo.public_id) {
    continue; // skip old-format images
  }

  if (!localHashes.includes(photo.hash)) {
    console.log("🗑 Removing deleted image:", photo.public_id);

    try {
      await cloudinary.uploader.destroy(photo.public_id);
    } catch (err) {
      console.log("⚠ Failed to delete from Cloudinary:", err.message);
    }

    place.photos = place.photos.filter(p => p.hash !== photo.hash);
  }
}

  console.log("\n🎉 Production sync complete!");
  process.exit(0);
}
}

seedHotels();
