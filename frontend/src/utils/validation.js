import { z } from "zod";

export const authSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  name: z.string().min(2, "Name is required"),
  businessEmail: z.string().email("Invalid corporate email format"),
  businessType: z.string().min(1, "Please select an organisation type"),
  registrationNumber: z.string().min(3, "Valid tracking code code is required"),
  cacCertificate: z.any().refine((files) => files?.length > 0, "Incorporation file is mandatory"),
certificate: z.any().optional(),
healthLicense: z.any().optional(),
  // Include validation for conditional targets based on layout criteria...
  country: z.string().min(1, "Country target base must be explicitly assigned"),
  stateOrRegion: z.string().min(1, "Administrative region division is required"),
  city: z.string().min(2, "City designation is required"),
  phone: z.string().min(7, "A valid contact link is mandatory"),
  pickupAddress: z.string().min(6, "Please designate an absolute legal fulfillment anchor address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character (@, #, $, etc.)"),

  // confirmPassword: only checked for min length here.
  // The actual match check is done manually in the component via useEffect + setError,
  // because Zod's .refine() cross-field check does NOT run during per-field trigger() calls.
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z.boolean().refine((val) => val === true, "You must accept the terms to activate operations"),
});



export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
