const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');
const Place = require("../models/Place"); // adjust path if needed

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces
} = require('../controllers/placeController');


// TEMPORARY: Seed 5 sample places
// router.get("/seed", async (req, res) => {
//   try {
//     const samplePlaces = [
//       {
//         title: "Sea View Apartment",
//         address: "Goa, India",
//         price: 3500,
//         maxGuests: 3,
//         photos: [],
//         description: "Beautiful apartment with a view of the sea.",
//         perks: ["wifi", "parking", "balcony"]
//       },
//       {
//         title: "Mountain Cabin",
//         address: "Manali, India",
//         price: 2500,
//         maxGuests: 4,
//         photos: [],
//         description: "Cozy cabin in the mountains with a fireplace.",
//         perks: ["wifi", "kitchen", "heating"]
//       },
//       {
//         title: "City Center Studio",
//         address: "Mumbai, India",
//         price: 3000,
//         maxGuests: 2,
//         photos: [],
//         description: "Compact studio in the heart of the city.",
//         perks: ["wifi", "ac", "tv"]
//       },
//       {
//         title: "Luxury Villa",
//         address: "Bangalore, India",
//         price: 8000,
//         maxGuests: 6,
//         photos: [],
//         description: "Spacious villa with pool and garden.",
//         perks: ["wifi", "pool", "parking", "ac"]
//       },
//       {
//         title: "Desert Safari Tent",
//         address: "Jaisalmer, India",
//         price: 4000,
//         maxGuests: 4,
//         photos: [],
//         description: "Authentic desert tent experience under the stars.",
//         perks: ["campfire", "breakfast", "parking"]
//       }
//     ];

//   //   // Insert into DB
//   //   const places = await Place.insertMany(samplePlaces);
//   //   res.status(201).json({ message: "Seed successful!", places });
//   // } catch (err) {
//   //   console.error(err);
//   //   res.status(500).json({ error: "Seeding failed" });
//   // }
// });

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// CREATE a place
router.post("/", async (req, res) => {
  try {
    const {
      title,
      address,
      description,
      price,
      photos,
    } = req.body;
    // const place = await Place.create(req.body);
    const place = await Place.create({
      title,
      address,
      description,
      price,
      photos, // 👈 cloudinary URLs
    });
    // res.json(place);
    res.status(201).json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create place" });
  }
});



/* GET all places */
router.get("/", async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

/* 🔹 GET single place by ID (ADD THIS BELOW) */
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    res.json(place);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.route('/').get(getPlaces);

// Protected routes (user must be logged in)
router.route('/add-places').post(isLoggedIn, addPlace);
router.route('/user-places').get(isLoggedIn, userPlaces);
router.route('/update-place').put(isLoggedIn, updatePlace);

// Not Protected routed but sequence should not be interfered with above routes
router.route('/:id').get(singlePlace);
router.route('/search/:key').get(searchPlaces)


module.exports = router;
