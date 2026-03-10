// import mongoose from "mongoose";

// const adminSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// export default mongoose.model("Admin", adminSchema);

import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Admin", adminSchema);