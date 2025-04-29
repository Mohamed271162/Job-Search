import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { Application } from "./application.models.js";

let userSchema = new Schema(
  {
    firstName: String,
    lastName: String,
    username: {
      type: String,
      unique: true,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be more than 6"],
    },
    recoveryEmail: String,
    passwordChangedAt: Date,
    DateofBirth: {
      type: Date,
      required: [true, "must be as YYYY-MM--DD"],
    },
    mobileNumber: {
      type: Number,
      unique: true,
      required: [true, "mobile number is required"],
    },
    role: {
      type: String,
      enum: ["User", "Company_Hr"],
      default: "User",
    },
    status: {
      type: String,
      enum: ["Online", "Offline"],
      default: "Offline",
    },
    resetOTP: { type: String, required: false }, // Ensure this is defined
    resetOTPExpiration: { type: Date, required: false },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre("save", function (next) {
  this.username = `${this.firstName}${this.lastName}`;
  next();
});

/*userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 8); // Use async hashing
  }
  next();
});

// Hash password when updating with findOneAndUpdate
userSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.password) {
    this._update.password = bcrypt.hashSync(this._update.password, 8);
  }
  next();
});*/

userSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    const userId = this.getQuery()["_id"];
    await Application.deleteMany({ userId: userId })
      .then(() => {
        next();
      })
      .catch((err) => {
        return next(new AppError("Failed to delete related applications", 500));
      });
  }
);

export const User = mongoose.model("User", userSchema);
