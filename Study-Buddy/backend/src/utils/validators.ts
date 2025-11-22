import { z } from 'zod';

/**
 * Zod validation schemas for API requests
 */

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Study plan schemas
// Note: multipart/form-data sends all fields as strings, so we need to coerce
export const createStudyPlanSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters').max(255),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.coerce.number().int().min(1, 'Duration must be at least 1 day').max(365, 'Duration cannot exceed 365 days'),
});

// Agent request schemas
export const researchAgentSchema = z.object({
  studyPlanId: z.string().uuid('Invalid study plan ID'),
});

export const compileAgentSchema = z.object({
  studyPlanId: z.string().uuid('Invalid study plan ID'),
});

export const scheduleAgentSchema = z.object({
  studyPlanId: z.string().uuid('Invalid study plan ID'),
});

export const chatRequestSchema = z.object({
  studyPlanId: z.string().uuid('Invalid study plan ID'),
  message: z.string().min(1, 'Message cannot be empty').max(5000, 'Message too long'),
  mode: z.enum(['chat', 'quiz']),
});

// Resource query schemas
export const resourceQuerySchema = z.object({
  studyPlanId: z.string().uuid('Invalid study plan ID').optional(),
});

/**
 * Validate file upload
 */
export function validateFileUpload(file: Express.Multer.File): { valid: boolean; error?: string } {
  const maxSize = parseInt(process.env.MAX_FILE_SIZE || '62914560'); // 60MB
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (!allowedTypes.includes(file.mimetype)) {
    return {
      valid: false,
      error: `File type ${file.mimetype} is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
}

/**
 * Validate multiple file uploads
 */
export function validateFileUploads(files: Express.Multer.File[]): { valid: boolean; errors?: string[] } {
  const errors: string[] = [];

  for (const file of files) {
    const validation = validateFileUpload(file);
    if (!validation.valid && validation.error) {
      errors.push(`${file.originalname}: ${validation.error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}
