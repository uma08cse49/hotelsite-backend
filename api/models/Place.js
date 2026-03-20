const mongoose = require("mongoose");




// const placeSchema = new mongoose.Schema({...}, { timestamps: true });
const placeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    // required: true,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // photos: [{ type: String }],
  photos: [
  {
    // url: String,
    // hash: String,
    // public_id: String

     url: { type: String, required: true },
     hash: String,
     public_id: String,
     category: {
      type: String,
      default: "Other"
    }
  }
],
coverPhoto: String,
isDeleted: {
  type: Boolean,
  default: false
},
isPublished: {
  type: Boolean,
  default: true
},
isActive: {
  type: Boolean,
  default: true
},
city: String, 


  description: {
    type: String,
  },
  perks: [{ type: String }],
  extraInfo: {
    type: String,
  },
  maxGuests: {
    type: Number,
  },
  price: {
    type: Number,
  },
},
 { 
    timestamps: true 
  }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;

