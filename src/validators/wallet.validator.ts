import Joi from 'joi';
import { TransferRequest, WithdrawRequest, FundWalletRequest } from '../types';

export const validateTransfer = (data: TransferRequest) => {
  const schema = Joi.object({
    recipient_email: Joi.string().email().required(),
    amount: Joi.number().positive().required()
  });

  return schema.validate(data);
};

export const validateWithdraw = (data: WithdrawRequest) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    bank_account: Joi.string().required()
  });

  return schema.validate(data);
};

export const validateFunding = (data: FundWalletRequest) => {
  const schema = Joi.object({
    amount: Joi.number().positive().required(),
    payment_reference: Joi.string().required()
  });

  return schema.validate(data);
};

export const validateUser = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required()
  });

  return schema.validate(data);
};