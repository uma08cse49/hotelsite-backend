import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

mongoose.connect("mongodb://127.0.0.1:27017/airbnb-clone");

const createAdmin = async () => {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new Admin({
      username: "admin",
      email:"admin@test.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("✅ Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();