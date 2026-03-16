import { z } from 'zod';

// ── Contact form ──────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be at most 2000 characters'),
  honeypot: z
    .string()
    .max(0, 'Invalid submission')
    .optional()
    .default(''),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ── Newsletter form ───────────────────────────────────────────────────────────

export const newsletterSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ── Enrollment / admission application ───────────────────────────────────────

const phoneRegex = /^(\+[1-9]\d{7,14}|\d{7,15})$/;

export const applicationSchema = z.object({
  student: z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    dateOfBirth: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be in YYYY-MM-DD format'),
    gradeApplyingFor: z.string().min(1, 'Grade is required').max(50),
    previousSchool: z.string().max(200).optional(),
  }),
  guardian: z.object({
    name: z.string().min(2, 'Guardian name is required').max(100),
    relationship: z.string().min(1, 'Relationship is required').max(50),
    phone: z
      .string()
      .regex(phoneRegex, 'Please enter a valid phone number'),
    email: z.email('Please enter a valid email address'),
    address: z.string().min(5, 'Address is required').max(300),
  }),
  academic: z.object({
    currentGrade: z.string().min(1, 'Current grade is required').max(50),
    subjects: z.array(z.string()).min(1, 'At least one subject is required'),
    specialNeeds: z.string().max(1000).optional(),
    languagesSpoken: z
      .array(z.string())
      .min(1, 'At least one language is required'),
  }),
  additional: z.object({
    howDidYouHear: z.string().min(1, 'This field is required').max(200),
    additionalNotes: z.string().max(2000).optional(),
    agreeToTerms: z.literal(true, {
      error: 'You must agree to the terms and conditions',
    }),
  }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// ── Job application form ──────────────────────────────────────────────────────

export const jobApplicationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  email: z.email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  position: z.string().min(1, 'Position is required'),
  coverLetter: z.string().max(2000, 'Cover letter must be at most 2000 characters').optional(),
});

export type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;
