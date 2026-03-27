import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,

    role: {
      type: String,
      enum: ["master", "hotel"],
      default: "master",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "blocked"],
      default: "pending",
    },

    mobile: String,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
