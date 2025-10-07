import * as yup from 'yup';

export const registerValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  address: yup
    .string()
    .required('Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain at least one uppercase letter and one special character'
    ),
});

export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  password: yup
    .string()
    .required('Password is required'),
});

export const updatePasswordValidationSchema = yup.object({
  newPassword: yup
    .string()
    .required('New password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain at least one uppercase letter and one special character'
    ),
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

export const createUserValidationSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .min(20, 'Name must be at least 20 characters')
    .max(60, 'Name must not exceed 60 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  address: yup
    .string()
    .required('Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must not exceed 16 characters')
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/,
      'Password must contain at least one uppercase letter and one special character'
    ),
  role: yup
    .string()
    .required('Role is required')
    .oneOf(['ADMIN', 'USER', 'STORE_OWNER'], 'Invalid role'),
});

export const createStoreValidationSchema = yup.object({
  name: yup
    .string()
    .required('Store name is required')
    .min(20, 'Store name must be at least 20 characters')
    .max(60, 'Store name must not exceed 60 characters'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
  address: yup
    .string()
    .required('Address is required')
    .max(400, 'Address must not exceed 400 characters'),
  ownerId: yup
    .string()
    .optional(),
});

export const ratingValidationSchema = yup.object({
  rating: yup
    .number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5')
    .integer('Rating must be a whole number'),
});