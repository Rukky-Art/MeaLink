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

  // confirmPassword: only checked for min length here.
  // The actual match check is done manually in the component via useEffect + setError,
  // because Zod's .refine() cross-field check does NOT run during per-field trigger() calls,
  // meaning it would silently pass the step gate even on a mismatch.
  confirmPassword: z.string().min(1, "Please confirm your password"),

  // Step 2 Fields
  businessName: z.string().min(2, "Name field is required"),
  businessType: z.string().min(2, "Type field is required"),
  registrationNumber: z.string().min(2, "Registration Number is required"),

  // FIX: strip spaces before validating so "+234 678 334 7589" is accepted.
  // The regex now tests the digits-only version, allowing any spacing the user types.
  phone: z.string()
    .min(1, "Phone number is required")
    .transform((val) => val.replace(/\s+/g, ''))
    .refine(
      (val) => /^\+?[0-9]{10,15}$/.test(val),
      "Enter a valid phone number (e.g. +234 800 000 0000)"
    ),

  city: z.string().min(2, "Please enter a valid city"),
  country: z.string().min(2, "Please enter a valid country"),
  location: z.string().optional(),
  certificate: z.any().optional(),
});

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
