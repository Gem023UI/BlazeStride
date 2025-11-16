import * as Yup from 'yup';

export const reviewValidationSchema = Yup.object().shape({
  rating: Yup.number()
    .required('Rating is required')
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  reviewDescription: Yup.string()
    .required('Review description is required')
    .min(10, 'Review must be at least 10 characters')
    .max(1000, 'Review cannot exceed 1000 characters'),
  reviewImages: Yup.array()
    .max(5, 'Cannot upload more than 5 images')
    .of(Yup.mixed())
});