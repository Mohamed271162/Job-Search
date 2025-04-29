import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcrypt";

let companySchema = new Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: [true, "name is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    industry: {
      type: String,
      required: [true, "industry is required"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    numbersOfEmployees: {
      from: Number,
      to: Number,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be more than 6"],
    },
    companyHR: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

companySchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
  console.log(this);
});

companySchema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
  console.log(this);
});

export const Company = mongoose.model("Company", companySchema);
