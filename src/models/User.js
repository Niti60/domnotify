import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: [
        "student",
        "developer",
        "entrepreneur",
        "company",
      ],
      required: true,
    },

    companyName: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isPremiumUser: {
      type: Boolean,
      required: true,
      default: false,
    },

    premiumPlanType: {
      type: String,
      default: null,
    },

    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const User =
  mongoose.models.User ||
  mongoose.model("User", UserSchema);

export default User;