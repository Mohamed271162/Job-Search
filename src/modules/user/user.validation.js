import Joi from "joi";

const signUpValidSchema = Joi.object({
  firstName: Joi.string().min(2).max(20).required(),
  lastName: Joi.string().min(2).max(20).required(),
  username: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  rePassword: Joi.valid(Joi.ref("password")).required(),
  mobileNumber: Joi.string()
    .pattern(/^(?:\+20|0)(1[0-9]{9})$/)
    .required(),
  DateofBirth: Joi.date().iso().less("now").required(),
  role: Joi.string().valid("User", "Company_Hr").default("User"),
});

const signInValidSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
});

const changeUserPasswordValidSchema = Joi.object({
  email: Joi.string().email().required(),
  oldPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  newPassword: Joi.string()
    .pattern(/^[A-Z][A-Za-z0-9]{8,40}$/)
    .required(),
  id: Joi.string().hex().length(24).required(),
});

const updateUserValidSchema = Joi.object({
  name: Joi.string().min(2).max(1000),
  email: Joi.string().min(2).max(2000),
  recoveryEmail: Joi.string().min(2).max(2000),
  password: Joi.string().pattern(/^[A-Z][A-Za-z0-9]{8,40}$/),
  id: Joi.string().hex().length(24).required(),
});

export {
  signUpValidSchema,
  signInValidSchema,
  changeUserPasswordValidSchema,
  updateUserValidSchema,
};
