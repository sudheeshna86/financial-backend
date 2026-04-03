import { z } from 'zod';

// User Registration/Management Validation
export const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['Admin', 'Analyst', 'Viewer']).optional(),
  is_active: z.boolean().optional(),
});

// Financial Record Validation
export const recordSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, "Category is required"),
  entry_date: z.string().pipe(z.coerce.date()).optional(),
  notes: z.string().optional(),
});

// Login Validation
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});