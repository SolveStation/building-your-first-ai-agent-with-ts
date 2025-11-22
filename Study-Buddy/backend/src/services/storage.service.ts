import multer from 'multer';
import { RequestHandler } from 'express';
import { logger } from '../utils/logger';
import { ensureDirectoryExists, generateUniqueFilename } from '../utils/helpers';

/**
 * Storage Service
 * Handles file uploads using Multer
 */

const uploadDir = process.env.UPLOAD_DIR || './uploads';

// Ensure upload directory exists
ensureDirectoryExists(uploadDir).catch((err) => {
  logger.error('Failed to create upload directory:', err);
});

/**
 * Multer storage configuration
 */
const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await ensureDirectoryExists(uploadDir);
      cb(null, uploadDir);
    } catch (error: any) {
      cb(error, uploadDir);
    }
  },
  filename: (_req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(file.originalname);
    logger.debug(`Saving uploaded file as: ${uniqueFilename}`);
    cb(null, uniqueFilename);
  },
});

/**
 * File filter to validate uploads
 */
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '').split(',');

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn(`Rejected file upload: ${file.originalname} (${file.mimetype})`);
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

/**
 * Multer upload configuration
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '62914560'), // 60MB default
  },
});

/**
 * Upload middleware for single file
 */
export const uploadSingle: (fieldName: string) => RequestHandler = (fieldName: string) => {
  return upload.single(fieldName);
};

/**
 * Upload middleware for multiple files
 */
export const uploadMultiple: (fieldName: string, maxCount?: number) => RequestHandler = (fieldName: string, maxCount: number = 10) => {
  return upload.array(fieldName, maxCount);
};

/**
 * Upload middleware for multiple fields
 */
export const uploadFields: (fields: Array<{ name: string; maxCount: number }>) => RequestHandler = (fields: Array<{ name: string; maxCount: number }>) => {
  return upload.fields(fields);
};
