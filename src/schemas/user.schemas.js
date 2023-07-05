import Joi from "joi";

export const SignUpSchema = Joi.object({
  email: Joi.string().regex(RegExps.email).trim().required(),
  name: Joi.string().min(2).required(),
  password: Joi.string().regex(RegExps.password).required(),
});

export const SignInSchema = Joi.object({
  email: Joi.string().regex(RegExps.email).required(),
  password: Joi.string().regex(RegExps.password).required(),
});
