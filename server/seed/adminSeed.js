import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

const seedAdmin = async () => {
  try {
    await connectDB();

    console.log("Seeding admin...");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log("Missing ADMIN_EMAIL or ADMIN_PASSWORD in .env");
      process.exit(1);
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name: "Admin",
      email: email,
      password: hashedPassword,
    });

    console.log("Admin Created Successfully");
    console.log("Email:", admin.email);

    process.exit();
  } catch (error) {
    console.log("Error:", error.message);
    process.exit(1);
  }
};

seedAdmin();
