import { z } from "zod";

/** Shared validation schemas (used by both API routes and forms). */

export const aadhaarRegex = /^\d{12}$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const mobileRegex = /^[6-9]\d{9}$/;

export const registrationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  mobile: z.string().trim().regex(mobileRegex, "Enter a valid 10-digit mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  aadhaarNumber: z.string().trim().regex(aadhaarRegex, "Aadhaar must be 12 digits"),
  panNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(panRegex, "Enter a valid PAN (e.g. ABCDE1234F)"),
  selfieKey: z.string().min(1, "Selfie is required"),

  aadhaarImageKey: z.string().optional().or(z.literal("")),
  panImageKey: z.string().optional().or(z.literal("")),

  dob: z.string().optional().or(z.literal("")),
  gender: z.enum(["male", "female", "other", ""]).optional(),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),

  bank: z.object({
    accountHolderName: z.string().trim().min(2, "Enter account holder name"),
    accountNumber: z
      .string()
      .trim()
      .regex(/^\d{6,20}$/, "Enter a valid account number"),
    ifsc: z.string().trim().toUpperCase().regex(ifscRegex, "Enter a valid IFSC code"),
    bankName: z.string().trim().min(2, "Enter bank name"),
    branch: z.string().optional().or(z.literal("")),
  }),

  marksheet10Key: z.string().optional().or(z.literal("")),
  marksheet12Key: z.string().optional().or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const policySchema = z.object({
  category: z.string().min(1),
  insurerSlug: z.string().min(1),
  planName: z.string().trim().min(2, "Enter the plan name"),
  planType: z.enum(["term", "endowment", "ulip", "whole-life", "money-back", "other"]),

  proposerName: z.string().trim().min(2, "Enter proposer name"),
  proposerDob: z.string().min(1, "Enter date of birth"),
  proposerGender: z.enum(["male", "female", "other"]),
  proposerMobile: z.string().trim().regex(mobileRegex, "Enter a valid mobile number"),
  proposerEmail: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
  proposerPan: z.string().trim().toUpperCase().optional().or(z.literal("")),
  proposerAadhaar: z.string().trim().optional().or(z.literal("")),
  proposerAddress: z.string().optional().or(z.literal("")),
  occupation: z.string().optional().or(z.literal("")),
  annualIncome: z.coerce.number().nonnegative().optional(),
  tobaccoUser: z.coerce.boolean().optional(),
  medicalHistory: z.string().optional().or(z.literal("")),

  nomineeName: z.string().trim().min(2, "Enter nominee name"),
  nomineeRelation: z.string().trim().min(2, "Enter nominee relation"),
  nomineeDob: z.string().optional().or(z.literal("")),
  nomineeSharePercent: z.coerce.number().min(1).max(100).default(100),
  appointeeName: z.string().optional().or(z.literal("")),

  sumAssured: z.coerce.number().positive("Enter sum assured"),
  premiumAmount: z.coerce.number().positive("Enter premium amount"),
  premiumFrequency: z.enum(["monthly", "quarterly", "half-yearly", "yearly", "single"]),
  policyTermYears: z.coerce.number().int().positive("Enter policy term"),
  premiumPayingTermYears: z.coerce.number().int().positive("Enter premium paying term"),
  proposedStartDate: z.string().optional().or(z.literal("")),

  documents: z
    .array(z.object({ label: z.string(), key: z.string() }))
    .optional()
    .default([]),
  partnerNotes: z.string().optional().or(z.literal("")),
});

export type PolicyInput = z.infer<typeof policySchema>;
