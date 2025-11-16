import * as Yup from 'yup';

export const userEditSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .required('First name is required'),
  
  lastname: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .required('Last name is required'),
  
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  
  phoneNumber: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, 'Invalid phone number format')
    .min(10, 'Phone number must be at least 10 digits')
    .max(20, 'Phone number must not exceed 20 characters')
    .nullable(),
  
  address: Yup.string()
    .max(200, 'Address must not exceed 200 characters')
    .nullable(),
  
  role: Yup.string()
    .oneOf(['customer', 'admin'], 'Invalid role')
    .required('Role is required'),
  
  status: Yup.string()
    .oneOf(['active', 'deactivated'], 'Invalid status')
    .required('Status is required')
});