import Joi from 'joi';

export const validateTransaction = (account) => {
  const accountSchema = {
    amount: Joi.number().required(),
  };
  return Joi.validate(account, accountSchema);
};
