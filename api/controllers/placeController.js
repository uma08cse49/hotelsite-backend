const Place = require('../models/Place');

console.log("UPDATE PLACE API HIT");

// Adds a place in the DB
exports.addPlace = async (req, res) => {
  try {
    const userData = req.user;
    const {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    } = req.body;
    const place = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      maxGuests,
      price,
    });
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err,
    });
  }
};

// Returns user specific places
exports.userPlaces = async (req, res) => {
  try {
    const userData = req.user;
    const id = userData.id;
    res.status(200).json(await Place.find({ owner: id }));
  } catch (err) {
    res.status(500).json({
      message: 'Internal serever error',
    });
  }
};

// Updates a place
// exports.updatePlace = async (req, res) => {
//   try {
//     const userData = req.user;
//     const userId = userData.id;
//     const {
//       id,
//       title,
//       address,
//       addedPhotos,
//       description,
//       perks,
//       extraInfo,
//       maxGuests,
//       price,
//     } = req.body;

//     // const place = await Place.findById(id);
//     const place = await Place.findByIdAndUpdate(
//       id,
//       data,
//       { new: true }
//     );

//     res.json({
//       success: true,
//       place
//     });
    
//     if (userId === place.owner.toString()) {
//       place.set({
//         title,
//         address,
//         photos: addedPhotos,
//         description,
//         perks,
//         extraInfo,
//         maxGuests,
//         price,
//       });
//       await place.save();
//       res.status(200).json({
//         message: 'place updated!',
//       });
//     }
//   } catch (err) {
//     res.status(500).json({
//       message: 'Internal server error',
//       error: err,
//     });
//   }
// };


// exports.updatePlace = async (req, res) => {
//   try {

//     const { id, photos, ...otherData } = req.body;

//     const place = await Place.findById(id);

//     if (!place) {
//       return res.status(404).json({ message: "Place not found" });
//     }

//     // replace photos with new array
//     place.photos = photos;

//     // update other fields
//     Object.assign(place, otherData);

//     await place.save();

//     res.json({
//       success: true,
//       place,
//     });

//   } catch (error) {
//     console.log("UPDATE PLACE ERROR:", error);
//     res.status(500).json({ message: "Update failed" });
//   }
// };


exports.updatePlace = async (req, res) => {
  
  try {

    console.log("BODY:", req.body);

    const { id, photos, ...otherData } = req.body;

    const place = await Place.findById(id);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // update other fields first
    Object.assign(place, otherData);

    // then replace photos completely
    place.photos = photos || [];

    await place.save();

    console.log("UPDATED PHOTOS IN DB:", place.photos);

    res.json({
      success: true,
      place,
    });

  } catch (error) {
    console.log("UPDATE PLACE ERROR:", error);
    res.status(500).json({ message: "Update failed" });
  }
};




// Returns all the places in DB
exports.getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).json({
      places,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
};

// Returns single place, based on passed place id
exports.singlePlace = async (req, res) => {
  try {
    const { id } = req.params;
    const place = await Place.findById(id);
    if (!place) {
      return res.status(400).json({
        message: 'Place not found',
      });
    }
    res.status(200).json({
      place,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Internal serever error',
    });
  }
};

// Search Places in the DB
exports.searchPlaces = async (req, res) => {
  try {
    const searchword = req.params.key;

    if (searchword === '') return res.status(200).json(await Place.find())

    const searchMatches = await Place.find({ address: { $regex: searchword, $options: "i" } })

    res.status(200).json(searchMatches);
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Internal serever error 1',
    });
  }
}