import * as yup from "yup";

export const orderValidationSchema = yup.object().shape({
  fullName: yup
    .string()
    .required("Full name is required")
    .matches(/^[A-Za-z\s]+$/, "Full name must contain only letters"),
  address: yup.string().required("Address is required"),
  zipCode: yup
    .string()
    .required("Zip code is required")
    .matches(/^\d+$/, "Zip code must contain only numbers"),
  city: yup.string().required("City/Province is required"),
  phoneNumber: yup
    .string()
    .required("Phone number is required")
    .matches(/^\d+$/, "Phone number must contain only numbers")
    .min(11, "Phone number must be exactly 11 digits")
    .max(11, "Phone number must be exactly 11 digits"),
});