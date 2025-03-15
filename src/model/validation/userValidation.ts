import { z } from 'zod';

export const userValidationType = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(5),
  profileImage: z.object({
    originalProfile: z.string().optional(),
    thumbnail: z.string().optional(),
  }).optional(),
 
  admin: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
  phone: z.string().min(10).optional(),
  createdAt: z.date().optional(),
});

export type UserValidationSchema = z.infer<typeof userValidationType>;
