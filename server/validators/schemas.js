const { z } = require('zod');

// Helper for parsing JSON strings when fields come from multipart/form-data
const jsonOrDirect = (schema) =>
  z.preprocess((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        return val;
      }
    }
    return val;
  }, schema);

// MongoDB ObjectId validation: exact 24-character hexadecimal string
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectIdSchema = z
  .string({ required_error: 'ID is required' })
  .regex(objectIdRegex, 'Must be a valid 24-character hexadecimal ObjectId');

// Safe Media URL validation: enforces HTTP/HTTPS or relative path, prohibiting javascript: and data: URIs
const safeMediaUrlSchema = z
  .string()
  .trim()
  .max(1000, 'Media URL cannot exceed 1000 characters')
  .refine(
    (val) => !val || /^https?:\/\//i.test(val) || val.startsWith('/'),
    'Must be a valid HTTP/HTTPS URL or clean relative path (javascript: and data: URIs are prohibited)'
  )
  .optional();

// Route parameter ID schema
const paramIdSchema = z
  .object({
    id: objectIdSchema,
  })
  .strict();

// Standard pagination & search query schema
const paginationQuerySchema = z
  .object({
    pageNumber: z
      .string()
      .regex(/^[1-9]\d*$/, 'Page number must be a positive integer')
      .max(6, 'Page number out of allowable range')
      .optional(),
    keyword: z
      .string()
      .max(100, 'Search keyword cannot exceed 100 characters')
      .optional(),
    category: z
      .string()
      .max(100, 'Category cannot exceed 100 characters')
      .optional(),
  })
  .strict();

// ----------------------------------------------------
// AUTH SCHEMAS
// ----------------------------------------------------
const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format')
      .max(255, 'Email cannot exceed 255 characters')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(128, 'Password cannot exceed 128 characters'),
    role: z.enum(['student', 'admin']).optional(),
    bio: z
      .string()
      .max(1000, 'Bio cannot exceed 1000 characters')
      .optional(),
    educationalBackground: z
      .string()
      .max(200, 'Educational background cannot exceed 200 characters')
      .optional(),
    skills: jsonOrDirect(
      z.array(z.string().trim().max(50, 'Skill tag cannot exceed 50 characters')).max(50, 'Cannot exceed 50 skills')
    ).optional(),
    hobbies: jsonOrDirect(
      z.array(z.string().trim().max(50, 'Hobby tag cannot exceed 50 characters')).max(50, 'Cannot exceed 50 hobbies')
    ).optional(),
    socialLinks: jsonOrDirect(
      z
        .object({
          github: z.string().max(200, 'GitHub URL cannot exceed 200 characters').optional(),
          hackerrank: z.string().max(200, 'HackerRank URL cannot exceed 200 characters').optional(),
          linkedin: z.string().max(200, 'LinkedIn URL cannot exceed 200 characters').optional(),
        })
        .strict()
    ).optional(),
  })
  .strict();

const loginSchema = z
  .object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .email('Invalid email address format')
      .max(255, 'Email cannot exceed 255 characters')
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required')
      .max(128, 'Password cannot exceed 128 characters'),
  })
  .strict();

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name must be at least 1 character')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .email('Invalid email address format')
      .max(255, 'Email cannot exceed 255 characters')
      .toLowerCase()
      .optional(),
    password: z
      .string()
      .max(128, 'Password cannot exceed 128 characters')
      .refine((val) => !val || val.length >= 6, {
        message: 'Password must be at least 6 characters',
      })
      .optional(),
    bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
    educationalBackground: z
      .string()
      .max(200, 'Educational background cannot exceed 200 characters')
      .optional(),
    skills: z
      .preprocess((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (e) {
            return val.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return val;
      }, z.array(z.string().max(50)).max(50))
      .optional(),
    hobbies: z
      .preprocess((val) => {
        if (typeof val === 'string') {
          try {
            return JSON.parse(val);
          } catch (e) {
            return val.split(',').map((s) => s.trim()).filter(Boolean);
          }
        }
        return val;
      }, z.array(z.string().max(50)).max(50))
      .optional(),
    socialLinks: jsonOrDirect(
      z
        .object({
          github: z.string().max(200).optional(),
          hackerrank: z.string().max(200).optional(),
          linkedin: z.string().max(200).optional(),
        })
        .strict()
    ).optional(),
    avatar: safeMediaUrlSchema,
  })
  .strict();

// ----------------------------------------------------
// COURSE SCHEMAS
// ----------------------------------------------------
const moduleItemSchema = z
  .object({
    title: z
      .string({ required_error: 'Module title is required' })
      .trim()
      .min(1, 'Module title is required')
      .max(200, 'Module title cannot exceed 200 characters'),
    content: z
      .string({ required_error: 'Module content is required' })
      .min(1, 'Module content is required')
      .max(10000, 'Module content cannot exceed 10000 characters'),
    order: z
      .preprocess((val) => (val !== undefined ? Number(val) : 0), z.number().int().min(0).max(1000))
      .optional(),
  })
  .strict();

const createCourseSchema = z
  .object({
    title: z
      .string({ required_error: 'Course title is required' })
      .trim()
      .min(2, 'Course title must be at least 2 characters')
      .max(200, 'Course title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Course description is required' })
      .trim()
      .min(5, 'Course description must be at least 5 characters')
      .max(5000, 'Course description cannot exceed 5000 characters'),
    category: z
      .string({ required_error: 'Course category is required' })
      .trim()
      .min(2, 'Course category must be at least 2 characters')
      .max(100, 'Course category cannot exceed 100 characters'),
    thumbnail: safeMediaUrlSchema,
    modules: jsonOrDirect(z.array(moduleItemSchema).max(50, 'Cannot exceed 50 modules')).optional(),
  })
  .strict();

const updateCourseSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(5).max(5000).optional(),
    category: z.string().trim().min(2).max(100).optional(),
    thumbnail: safeMediaUrlSchema,
    modules: jsonOrDirect(z.array(moduleItemSchema).max(50)).optional(),
  })
  .strict();

// ----------------------------------------------------
// MOCK TEST SCHEMAS
// ----------------------------------------------------
const questionItemSchema = z
  .object({
    questionText: z
      .string({ required_error: 'Question text is required' })
      .trim()
      .min(1, 'Question text cannot be empty')
      .max(1000, 'Question text cannot exceed 1000 characters'),
    options: z
      .array(z.string().trim().min(1, 'Option text cannot be empty').max(500))
      .min(2, 'At least 2 options are required')
      .max(10, 'Cannot exceed 10 options'),
    correctAnswer: z
      .union([z.string().trim().min(1), z.number().int().min(0)])
      .transform(String),
    explanation: z.string().max(2000, 'Explanation cannot exceed 2000 characters').optional(),
  })
  .strict();

const createMockTestSchema = z
  .object({
    title: z
      .string({ required_error: 'Test title is required' })
      .trim()
      .min(2, 'Test title must be at least 2 characters')
      .max(200, 'Test title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Test description is required' })
      .trim()
      .min(5, 'Test description must be at least 5 characters')
      .max(2000, 'Test description cannot exceed 2000 characters'),
    category: z
      .string({ required_error: 'Category is required' })
      .trim()
      .min(2, 'Category must be at least 2 characters')
      .max(100, 'Category cannot exceed 100 characters'),
    duration: z.preprocess(
      (val) => Number(val),
      z
        .number({ required_error: 'Duration is required' })
        .int('Duration must be an integer')
        .min(1, 'Duration must be at least 1 minute')
        .max(300, 'Duration cannot exceed 300 minutes')
    ),
    passingScore: z
      .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(0).max(100))
      .optional(),
    questions: jsonOrDirect(
      z
        .array(questionItemSchema)
        .min(1, 'Test must include at least 1 question')
        .max(100, 'Cannot exceed 100 questions per test')
    ),
  })
  .strict();

const updateMockTestSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(5).max(2000).optional(),
    category: z.string().trim().min(2).max(100).optional(),
    duration: z
      .preprocess(
        (val) => (val !== undefined ? Number(val) : undefined),
        z.number().int().min(1).max(300)
      )
      .optional(),
    passingScore: z
      .preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(0).max(100))
      .optional(),
    questions: jsonOrDirect(z.array(questionItemSchema).min(1).max(100)).optional(),
  })
  .strict();

// ----------------------------------------------------
// RESULT SCHEMAS
// ----------------------------------------------------
const answerItemSchema = z
  .object({
    questionIndex: z
      .number({ required_error: 'questionIndex is required' })
      .int('questionIndex must be an integer')
      .min(0, 'questionIndex cannot be negative'),
    selectedOption: z
      .union([z.string().max(500), z.number().int().min(0)])
      .transform(String),
  })
  .strict();

const submitResultSchema = z
  .object({
    mockTestId: objectIdSchema,
    answers: z
      .array(answerItemSchema)
      .min(1, 'At least 1 answer must be submitted')
      .max(200, 'Cannot exceed 200 answers'),
    timeTaken: z
      .preprocess((val) => (val !== undefined ? Number(val) : 0), z.number().min(0).max(86400))
      .optional(),
  })
  .strict();

// ----------------------------------------------------
// ANNOUNCEMENT SCHEMAS
// ----------------------------------------------------
const createAnnouncementSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    message: z
      .string({ required_error: 'Message is required' })
      .trim()
      .min(2, 'Message must be at least 2 characters')
      .max(5000, 'Message cannot exceed 5000 characters'),
  })
  .strict();

// ----------------------------------------------------
// STUDY MATERIAL SCHEMAS
// ----------------------------------------------------
const materialQuerySchema = z
  .object({
    pageNumber: z
      .string()
      .regex(/^[1-9]\d*$/, 'Page number must be a positive integer')
      .max(6)
      .optional(),
    keyword: z.string().max(100).optional(),
    type: z.enum(['pdf', 'link', 'notes']).optional(),
  })
  .strict();

const createMaterialSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(5, 'Description must be at least 5 characters')
      .max(2000, 'Description cannot exceed 2000 characters'),
    category: z
      .string({ required_error: 'Category is required' })
      .trim()
      .min(2, 'Category must be at least 2 characters')
      .max(100, 'Category cannot exceed 100 characters'),
    fileUrl: z
      .string({ required_error: 'File URL is required' })
      .trim()
      .min(1, 'File URL is required')
      .max(1000, 'File URL cannot exceed 1000 characters')
      .refine(
        (val) => /^https?:\/\//i.test(val) || val.startsWith('/'),
        'File URL must be a valid HTTP/HTTPS URL or relative path'
      ),
    type: z.enum(['pdf', 'link', 'notes'], {
      required_error: 'Type must be one of: pdf, link, notes',
    }),
  })
  .strict();

const updateMaterialSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(5).max(2000).optional(),
    category: z.string().trim().min(2).max(100).optional(),
    fileUrl: safeMediaUrlSchema,
    type: z.enum(['pdf', 'link', 'notes']).optional(),
  })
  .strict();

// ----------------------------------------------------
// TUTORIAL SCHEMAS
// ----------------------------------------------------
const createTutorialSchema = z
  .object({
    title: z
      .string({ required_error: 'Title is required' })
      .trim()
      .min(2, 'Title must be at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .trim()
      .min(5, 'Description must be at least 5 characters')
      .max(2000, 'Description cannot exceed 2000 characters'),
    category: z
      .string({ required_error: 'Category is required' })
      .trim()
      .min(2, 'Category must be at least 2 characters')
      .max(100, 'Category cannot exceed 100 characters'),
    content: z
      .string({ required_error: 'Content is required' })
      .min(5, 'Content must be at least 5 characters')
      .max(50000, 'Content cannot exceed 50000 characters'),
    tags: jsonOrDirect(
      z.array(z.string().trim().max(50, 'Tag cannot exceed 50 characters')).max(20, 'Cannot exceed 20 tags')
    ).optional(),
    thumbnail: safeMediaUrlSchema,
    videoUrl: safeMediaUrlSchema,
  })
  .strict();

const updateTutorialSchema = z
  .object({
    title: z.string().trim().min(2).max(200).optional(),
    description: z.string().trim().min(5).max(2000).optional(),
    category: z.string().trim().min(2).max(100).optional(),
    content: z.string().min(5).max(50000).optional(),
    tags: jsonOrDirect(z.array(z.string().trim().max(50)).max(20)).optional(),
    thumbnail: safeMediaUrlSchema,
    videoUrl: safeMediaUrlSchema,
  })
  .strict();

// ----------------------------------------------------
// CLOUDINARY SCHEMAS
// ----------------------------------------------------
const cloudinarySignatureSchema = z
  .object({
    folder: z
      .enum(['lms/tutorials', 'lms/images', 'lms/materials'], {
        errorMap: () => ({ message: 'Folder must be one of: lms/tutorials, lms/images, lms/materials' }),
      })
      .default('lms/tutorials')
      .optional(),
  })
  .strict();

module.exports = {
  objectIdSchema,
  paramIdSchema,
  paginationQuerySchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createCourseSchema,
  updateCourseSchema,
  createMockTestSchema,
  updateMockTestSchema,
  submitResultSchema,
  createAnnouncementSchema,
  materialQuerySchema,
  createMaterialSchema,
  updateMaterialSchema,
  createTutorialSchema,
  updateTutorialSchema,
  cloudinarySignatureSchema,
};
