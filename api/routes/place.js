// const express = require('express');
// const router = express.Router();
// const { isLoggedIn } = require('../middlewares/user');
// const Place = require("../models/Place"); // adjust path if needed

// const {
//   addPlace,
//   getPlaces,
//   updatePlace,
//   singlePlace,
//   userPlaces,
//   searchPlaces
// } = require('../controllers/placeController');




// router.get("/", async (req, res) => {
//   try {
//     const places = await Place.find();
//     res.json(places);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });

// // CREATE a place
// router.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       address,
//       description,
//       price,
//       photos,
//     } = req.body;
//     // const place = await Place.create(req.body);
//     const place = await Place.create({
//       title,
//       address,
//       description,
//       price,
//       photos, // 👈 cloudinary URLs
//     });
//     // res.json(place);
//     res.status(201).json(place);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create place" });
//   }
// });



// /* GET all places */
// router.get("/", async (req, res) => {
//   const places = await Place.find();
//   res.json(places);
// });

// /* 🔹 GET single place by ID (ADD THIS BELOW) */
// router.get("/:id", async (req, res) => {
//   try {
//     const place = await Place.findById(req.params.id);
//     if (!place) {
//       return res.status(404).json({ error: "Place not found" });
//     }
//     res.json(place);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid ID" });
//   }
// });

// router.route('/').get(getPlaces);

// // Protected routes (user must be logged in)
// router.route('/add-places').post(isLoggedIn, addPlace);
// router.route('/user-places').get(isLoggedIn, userPlaces);
// router.route('/update-place').put(isLoggedIn, updatePlace);

// // Not Protected routed but sequence should not be interfered with above routes
// router.route('/:id').get(singlePlace);
// router.route('/search/:key').get(searchPlaces)


// module.exports = router;




const express = require('express');
const router = express.Router();
const Place = require("../models/Place");

// GET all places
router.get("/", async (req, res) => {
  try {
    const places = await Place.find({isDeleted: false});
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});

// CREATE place
// router.post("/", async (req, res) => {
//   try {
//     const { title, address, description, price, photos } = req.body;

//     const place = await Place.create({
//       title,
//       address,
//       description,
//       price,
//       photos: photos || []   // safety
//     });

//     res.status(201).json(place);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create place" });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const {
      owner,
      title,
      address,
      description,
      price,
      photos,
      coverPhoto,
      perks,
      extraInfo,
      maxGuests
    } = req.body;

    const place = await Place.create({
      owner,
      title,
      address,
      description,
      price,
      photos: photos || [],
      coverPhoto,
      perks: perks || [],
      extraInfo,
      maxGuests
    });

    res.status(201).json(place);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create place" });
  }
});

// GET single place
router.get("/:id", async (req, res) => {
  try {
    // const place = await Place.findById(req.params.id);
    const place = await Place.findOne({
    _id: req.params.id,
    isDeleted: false
  });

  if (!place) {
  return res.status(404).json({ message: "Place not found" });
}

res.json({ place });

    // res.json(place);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID" });
  }
});

router.get("/places", async (req, res) => {
  const places = await Place.find(); // no filter here
  res.json(places);
});

router.get("/", async (req, res) => {
  const places = await Place.find({ isDeleted: false });
  res.json(places);
});


module.exports = router;
