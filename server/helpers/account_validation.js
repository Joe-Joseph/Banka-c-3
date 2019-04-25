import Joi from 'joi';

export const validateAccount = (account) => {
  const accountSchema = {
    type: Joi.string().valid('savings', 'current'),
  };
  return Joi.validate(account, accountSchema);
};
