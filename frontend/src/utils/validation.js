import { z } from "zod";

export const authSchema = z.object({
  // Step 1 Fields
  fullName: z.string().min(2, "Please enter a Contact Person's name"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (@, #, $, etc.)"),
  confirmPassword: z.string().min(8, "Please confirm your password"),

  // Step 2 Fields
  businessName: z.string().min(2, "Name field is required"),
  businessType: z.string().min(2, "Type field is required"),
  registrationNumber: z.string().min(2, "Registration Number is Required"),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, "Enter a valid phone number (e.g. +234...)"),
  city: z.string().min(2, "Please enter a valid city"),
  country: z.string().min(2, "Please enter a valid country"),
  location: z.string().optional(),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], 
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});