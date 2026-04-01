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
      enum: ["admin", "master", "hotel"],
      default: "master",
    },

    status: {
      type: String,
      enum: ["pending", "verified", "blocked"],
      default: "pending",
    },

    mobile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
