import { z } from "zod";

export const authSchema = z.object({
  // Common fields
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  businessName: z.string().min(2, "Business name is required"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number (e.g. +234...)"),
  location: z.string().min(3, "Please enter a valid location"),
  city: z.string().min(2, "Please enter a valid city"),
  country: z.string().min(2, "Please enter a valid country"),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["showConfirmPassword"], // This tells Zod to attach the error to the confirmPassword field
});

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Email is required") // Custom message for empty field
    .email("Please enter a valid email address"),
  password: z.string()
    .min(1, "Password is required") // Custom message for empty field
});