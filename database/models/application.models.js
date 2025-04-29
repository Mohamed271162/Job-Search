import mongoose, { Schema, Types } from "mongoose";

let applicationSchema = new Schema(
  {
    jobId: {
      type: Types.ObjectId,
      ref: "Job",
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    userTechnicalSkills: {
      type: [String],
      required: [true, "technical skills is required"],
    },
    userSoftSkills: {
      type: [String],
      required: [true, "soft skills is required"],
    },
    resume: {
      type: String,
      required: [true, "resume is required and must be as a PDF"],
    },
  },
  { timestamps: true, versionKey: false }
);

applicationSchema.post("init", function (doc) {
  doc.resume = process.env.BASE_URL + "applications/" + doc.resume;
});

export const Application = mongoose.model("Application", applicationSchema);
