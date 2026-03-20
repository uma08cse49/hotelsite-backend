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




// const express = require('express');
// const router = express.Router();
// const Place = require("../models/Place");
// const placeController = require("../controllers/placeController");

// // GET all places
// router.get("/", async (req, res) => {
//   try {
//     const places = await Place.find({isDeleted: false});
//     res.json(places);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });

// // CREATE place
// // router.post("/", async (req, res) => {
// //   try {
// //     const { title, address, description, price, photos } = req.body;

// //     const place = await Place.create({
// //       title,
// //       address,
// //       description,
// //       price,
// //       photos: photos || []   // safety
// //     });

// //     res.status(201).json(place);
// //   } catch (err) {
// //     res.status(500).json({ error: "Failed to create place" });
// //   }
// // });

// router.post("/", async (req, res) => {
//   try {
//     const {
//       owner,
//       title,
//       address,
//       description,
//       price,
//       photos,
//       coverPhoto,
//       perks,
//       extraInfo,
//       maxGuests
//     } = req.body;

//     const place = await Place.create({
//       owner,
//       title,
//       address,
//       description,
//       price,
//       photos: photos || [],
//       coverPhoto,
//       perks: perks || [],
//       extraInfo,
//       maxGuests
//     });

//     res.status(201).json(place);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create place" });
//   }
// });

// // GET single place
// router.get("/:id", async (req, res) => {
//   try {
//     // const place = await Place.findById(req.params.id);
//     const place = await Place.findOne({
//     _id: req.params.id,
//     isDeleted: false
//   });

//   if (!place) {
//   return res.status(404).json({ message: "Place not found" });
// }

// res.json({ place });

//     // res.json(place);
//   } catch (err) {
//     res.status(400).json({ error: "Invalid ID" });
//   }
// });

// router.get("/places", async (req, res) => {
//   const places = await Place.find(); // no filter here
//   res.json(places);
// });

// router.get("/", async (req, res) => {
//   const places = await Place.find({ isDeleted: false });
//   res.json(places);
// });

// // UPDATE PLACE
// router.put("/update-place", placeController.updatePlace);

// module.exports = router;


// module.exports = router;



// ================================================================================================


// const express = require("express");
// const router = express.Router();
// const Place = require("../models/Place");
// const placeController = require("../controllers/placeController");


// // GET USER PLACES
// router.get("/user-places", async (req, res) => {
//   try {
//     const places = await Place.find({ isDeleted: false });
//     res.json({ places });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });

// // GET SINGLE PLACE
// router.get("/:id", async (req, res) => {
//   try {
//     const place = await Place.findOne({
//       _id: req.params.id,
//       isDeleted: false
//     });

//     if (!place) {
//       return res.status(404).json({ message: "Place not found" });
//     }

//     res.json({ place });

//   } catch (err) {
//     res.status(400).json({ error: "Invalid ID" });
//   }
// });

// // UPDATE PLACE
// router.put("/update-place/:id", placeController.updatePlace);




// // GET ALL PLACES
// router.get("/", async (req, res) => {
//   try {
//     const places = await Place.find({ isDeleted: false });
//     res.json(places);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch places" });
//   }
// });


// // CREATE PLACE
// router.post("/", async (req, res) => {
//   try {
//     const {
//       owner,
//       title,
//       address,
//       description,
//       price,
//       photos,
//       coverPhoto,
//       perks,
//       extraInfo,
//       maxGuests
//     } = req.body;

//     const place = await Place.create({
//       owner,
//       title,
//       address,
//       description,
//       price,
//       photos: photos || [],
//       coverPhoto,
//       perks: perks || [],
//       extraInfo,
//       maxGuests
//     });

//     res.status(201).json(place);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to create place" });
//   }
// });






// module.exports = router;


// =====================================================================================================


const express = require("express");
const router = express.Router();
const Place = require("../models/Place");




// GET USER PLACES
router.get("/user-places", async (req, res) => {
  try {
    const places = await Place.find({ isDeleted: false });
    res.json({ places });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});


// GET ALL PLACES
router.get("/", async (req, res) => {
  try {
    const places = await Place.find({ isDeleted: false});
    res.json({places});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch places" });
  }
});


// GET SINGLE PLACE
router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }

    res.json({ place });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch place" });
  }
});


// CREATE PLACE
router.post("/", async (req, res) => {
  try {
    const place = await Place.create(req.body);

    res.status(201).json({
      success: true,
      place,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to create place" });
  }
});

router.post("/places", async (req, res) => {

  try {

    const {
      title,
      address,
      description,
      price,
      maxGuests,
      photos
    } = req.body;

    const place = await Place.create({
      title,
      address,
      description,
      price,
      maxGuests,
      photos
    });

    res.json({
      success: true,
      place
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

});

// module.exports = router;


// UPDATE PLACE
router.put("/:id", async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      place,
    });
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
});


// DELETE PLACE
router.delete("/:id", async (req, res) => {
  try {
    await Place.findByIdAndUpdate(req.params.id, { isDeleted: true });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// SOFT DELETE

router.put("/delete-place/:id", async (req, res) => {
  await Place.findByIdAndUpdate(req.params.id, {
    isDeleted: true
  });

  res.json({ message: "Place deleted" });
});

// UNPUBLISH LISTING

router.put("/toggle-publish/:id", async (req, res) => {

  const place = await Place.findById(req.params.id);

  place.isPublished = !place.isPublished;

  await place.save();

  res.json(place);
});

module.exports = router;