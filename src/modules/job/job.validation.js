import Joi from "joi";
import { generalFields } from "../../middleware/validate.js";

const addJobSchema = Joi.object({
  jobTitle: Joi.string().min(1).max(50).required(),
  companyName: Joi.string().min(1).max(50).required(),
  jobLocation: Joi.string().min(1).max(100).required(),
  workingTime: Joi.string().min(1).max(50).required(),
  seniorityLevel: Joi.string().min(1).max(50).required(),
  jobDescription: Joi.string().min(1).max(100).required(),
  technicalSkills: Joi.string().min(1).max(500).required(),
  softSkills: Joi.string().min(1).max(500).required(),
  companyId: Joi.string().hex().length(24).required(),
  addedBy: Joi.string().hex().length(24).required(),
});

const updateJobSchema = Joi.object({
  jobTitle: Joi.string().min(1).max(50),
  companyName: Joi.string().min(1).max(50),
  jobLocation: Joi.string().min(1).max(100),
  workingTime: Joi.string().min(1).max(50),
  seniorityLevel: Joi.string().min(1).max(50),
  jobDescription: Joi.string().min(1).max(100),
  technicalSkills: Joi.string().min(1).max(500),
  softSkills: Joi.string().min(1).max(500),
  companyId: Joi.string().hex().length(24),
  addedBy: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24).required(),
});

export { addJobSchema, updateJobSchema };
