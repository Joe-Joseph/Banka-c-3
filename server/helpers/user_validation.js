import Joi from 'joi';

export const validateUser = (user) => {
  const userSchema = {
    firstName: Joi.string().min(3).trim().required()
      .regex(/^[A-Za-z_]+$/),
    lastName: Joi.string().min(3).trim().required()
      .regex(/^[A-Za-z_]+$/),
    email: Joi.string().email({ minDomainAtoms: 2 }).trim().required(),
    password: Joi.string().min(6).required(),
    isAdmin: Joi.boolean().valid('true', 'false'),
    type: Joi.string().valid('user', 'staff'),
  };
  return Joi.validate(user, userSchema);
};

export const validateUserLogin = (login) => {
  const loginSchema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).trim().required(),
    password: Joi.string().min(6).required(),
  };

  return Joi.validate(login, loginSchema);
};
