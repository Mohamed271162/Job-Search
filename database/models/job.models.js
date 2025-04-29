import mongoose, { Schema, Types } from "mongoose";

import { Application } from "./application.models.js";

let jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "name is required"],
    },
    companyName: {
      type: String,
      required: [true, "name is required"],
    },
    jobLocation: {
      type: String,
      required: [true, "job location is required"],
      enum: ["onsite", "remote", "hybrid"],
    },
    workingTime: {
      type: String,
      required: [true, "working time is required"],
      enum: ["part-time", "full-time"],
    },
    seniorityLevel: {
      type: String,
      required: [true, "address is required"],
      enum: ["Junior", "Mid-Level", "Senior", "Team-Lead", "CTO"],
    },
    jobDescription: {
      type: String,
      required: [true, "description is required"],
    },
    technicalSkills: {
      type: [String],
      required: [true, "technical skills is required"],
    },
    softSkills: {
      type: [String],
      required: [true, "soft skills is required"],
    },
    companyId: { type: Types.ObjectId, ref: "Company", required: true },
    addedBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "addedBy is required"],
    },
  },
  { timestamps: true, versionKey: false }
);

// Pre-remove hook to delete related applications when a job is deleted
jobSchema.pre("remove", async function (next) {
  // 'this' refers to the job document being deleted
  await Application.deleteMany({ jobId: this._id }); // Assuming jobId in Application references the Job
  next();
});

export const Job = mongoose.model("Job", jobSchema);
