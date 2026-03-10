const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // adjust if your model name differs

mongoose.connect("mongodb://127.0.0.1:27017/airbnb-clone");

async function resetPassword() {
  const newHashedPassword = await bcrypt.hash("admin123", 10);

  const user = await User.findOneAndUpdate(
    { email: "admin@test.com" },
    { password: newHashedPassword }
  );

  if (!user) {
    console.log("Admin user not found");
  } else {
    console.log("Password updated successfully");
  }

  process.exit();
}

resetPassword();