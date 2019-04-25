import Joi from 'joi';

export const validateAccount = (account) => {
  const accountSchema = {
    type: Joi.string().trim().valid('savings', 'current').required(),
  };
  return Joi.validate(account, accountSchema);
};

export const validateAccountStatus = (status) => {
  const accountSchema = {
    status: Joi.string().trim().valid('dormant', 'active', 'draft').required(),
  };
  return Joi.validate(status, accountSchema);
};
