import Joi from "joi";

const addApplicationValidSchema = Joi.object({
  jobId: Joi.string().hex().length(24).required(),
  userId: Joi.string().hex().length(24).required(),
  userTechnicalSkills: Joi.string().min(1).max(100).required(),
  userSoftSkills: Joi.string().min(1).max(100).required(),
  resume: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("application/pdf").required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required(), // 5 MB limit
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }).required(),
});

const updateApplicationValidSchema = Joi.object({
  jobId: Joi.string().hex().length(24),
  userId: Joi.string().hex().length(24),
  userTechnicalSkills: Joi.string().min(1).max(100),
  userSoftSkills: Joi.string().min(1).max(100),
  resume: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().valid("application/pdf").required(),
    size: Joi.number()
      .max(5 * 1024 * 1024)
      .required(), // 5 MB limit
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
  id: Joi.string().hex().length(24).required(),
});

export { addApplicationValidSchema, updateApplicationValidSchema };
