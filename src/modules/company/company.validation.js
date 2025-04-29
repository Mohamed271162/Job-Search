import Joi from "joi";

const addCompanySchema = Joi.object({
  companyName: Joi.string().min(1).max(50).required(),
  description: Joi.string().min(1).max(500).required(),
  industry: Joi.string().min(1).max(100).required(),
  address: Joi.string().min(1).max(100).required(),
  companyEmail: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  //jobId: Joi.string().hex().length(24),
  companyHR: Joi.string().hex().length(24).required(),
});

const updateCompanySchema = Joi.object({
  companyName: Joi.string().min(1).max(50),
  description: Joi.string().min(1).max(500),
  industry: Joi.string().min(1).max(100),
  address: Joi.string().min(1).max(100),
  companyEmail: Joi.string().email(),
  password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{8,40}$/),
  jobId: Joi.string().hex().length(24),
  companyHR: Joi.string().hex().length(24),
  id: Joi.string().hex().length(24).required(),
});

export { addCompanySchema, updateCompanySchema };
