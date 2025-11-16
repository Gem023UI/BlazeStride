import * as Yup from 'yup';

export const productSchema = Yup.object().shape({
  productname: Yup.string()
    .min(3, 'Product name must be at least 3 characters')
    .max(100, 'Product name must not exceed 100 characters')
    .required('Product name is required'),
  
  description: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters')
    .required('Description is required'),
  
  category: Yup.array()
    .of(Yup.string().oneOf(['daily', 'tempo', 'marathon', 'race']))
    .min(1, 'At least one category must be selected')
    .required('Category is required'),
  
  price: Yup.number()
    .positive('Price must be a positive number')
    .min(0.01, 'Price must be at least 0.01')
    .max(999999.99, 'Price is too high')
    .required('Price is required'),
  
  stock: Yup.number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock value is too high')
    .required('Stock is required')
});