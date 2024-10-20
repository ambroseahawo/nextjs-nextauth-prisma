import Joi from 'joi';

export const signupSchema = Joi.object({
  username: Joi.string().min(2).max(30).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 2 characters long',
    'string.max': 'Username must be at most 30 characters long',
    'any.required': 'Username is required',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(16).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 8 characters long',
    'string.max': 'Password must be at most 16 characters long',
    'any.required': 'Password is required',
  }),
});

export const signInSchema = Joi.object({
  emailOrUsername: Joi.string().required().messages({
    'string.base': 'Email Or Username must be a string',
    'string.empty': 'Email Or Username is required',
    'any.required': 'Email Or Username is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
});
