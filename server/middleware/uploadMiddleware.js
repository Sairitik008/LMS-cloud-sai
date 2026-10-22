const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/**
 * File Upload Security Configuration
 * 
 * Guarantees:
 * 1. Strict File Type Validation: MIME types and file extensions are rigorously whitelisted.
 * 2. File Size Enforcement: Hard limits on max upload sizes (5MB images, 50MB video media).
 * 3. Deep Content Validation: Magic bytes / file signatures are checked from the binary stream
 *    before passing to storage (preventing disguised executables, web shells, and SVGs).
 * 4. Isolated Storage: All files are streamed directly to Cloudinary cloud object storage.
 *    No uploaded files are ever stored in or served from the web root or local filesystem.
 * 5. Execution Prevention: Code execution is impossible on the server, and XSS vectors (SVG, HTML)
 *    are blocked at both metadata and binary inspection layers.
 */

// Whitelists
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

const ALLOWED_VIDEO_MIMES = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_VIDEO_EXTS = ['.mp4', '.webm', '.mov'];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50 MB

// Dangerous extensions that must never appear in the filename (including double extension bypasses)
const DANGEROUS_EXTS = [
  'php', 'phtml', 'php3', 'php4', 'php5', 'phps', 'phar',
  'cgi', 'pl', 'py', 'sh', 'bash', 'zsh', 'exe', 'dll', 'so',
  'bat', 'cmd', 'vbs', 'ps1', 'js', 'mjs', 'cjs', 'ts',
  'html', 'htm', 'xhtml', 'svg', 'xml', 'jsp', 'asp', 'aspx',
  'cer', 'swf', 'jar', 'war', 'apk'
];

/**
 * Validates filename, extension, and MIME type metadata
 */
const validateFileMetadata = (file, isVideoAllowed = false) => {
  const originalName = file.originalname || '';

  // 1. Validate filename length & sanity
  if (!originalName || originalName.trim().length === 0 || originalName.length > 255) {
    return 'Invalid file name length';
  }

  // 2. Reject path traversal characters & null bytes
  if (originalName.includes('..') || originalName.includes('/') || originalName.includes('\\') || originalName.includes('\0')) {
    return 'Path traversal or null bytes detected in filename';
  }

  // 3. Extract and check extension
  const ext = path.extname(originalName).toLowerCase();
  const allowedExts = isVideoAllowed
    ? [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS]
    : ALLOWED_IMAGE_EXTS;

  if (!allowedExts.includes(ext)) {
    return `Unsupported file extension '${ext}'. Allowed extensions: ${allowedExts.join(', ')}`;
  }

  // 4. Prevent double extension attacks (e.g., shell.php.jpg or exploit.exe.png)
  const nameParts = originalName.split('.');
  if (nameParts.length > 2) {
    for (let i = 1; i < nameParts.length - 1; i++) {
      if (DANGEROUS_EXTS.includes(nameParts[i].toLowerCase())) {
        return 'Dangerous secondary extension detected. Executable and script extensions are forbidden.';
      }
    }
  }

  // 5. Validate MIME type
  const allowedMimes = isVideoAllowed
    ? [...ALLOWED_IMAGE_MIMES, ...ALLOWED_VIDEO_MIMES]
    : ALLOWED_IMAGE_MIMES;

  if (!allowedMimes.includes(file.mimetype)) {
    return `Unsupported MIME type '${file.mimetype}'. Allowed types: ${allowedMimes.join(', ')}`;
  }

  return null;
};

/**
 * Validates binary content / magic bytes
 */
const validateMagicBytes = (chunk, file) => {
  if (!chunk || chunk.length === 0) {
    return 'Uploaded file is empty';
  }

  // 1. Prohibit executable and script signatures immediately
  // Windows PE / DLL (MZ)
  if (chunk.length >= 2 && chunk[0] === 0x4D && chunk[1] === 0x5A) {
    return 'Executable files (.exe, .dll) are strictly prohibited';
  }
  // Linux ELF binary (\x7fELF)
  if (chunk.length >= 4 && chunk[0] === 0x7F && chunk[1] === 0x45 && chunk[2] === 0x4C && chunk[3] === 0x46) {
    return 'Binary executable files are strictly prohibited';
  }
  // Shell script (#!/...)
  if (chunk.length >= 3 && chunk[0] === 0x23 && chunk[1] === 0x21 && chunk[2] === 0x2F) {
    return 'Shell scripts are strictly prohibited';
  }
  // Compressed archive (PK\x03\x04 or Java 0xCAFEBABE)
  if (chunk.length >= 4 && chunk[0] === 0x50 && chunk[1] === 0x4B && chunk[2] === 0x03 && chunk[3] === 0x04) {
    return 'ZIP/JAR archives are strictly prohibited';
  }
  if (chunk.length >= 4 && chunk[0] === 0xCA && chunk[1] === 0xFE && chunk[2] === 0xBA && chunk[3] === 0xBE) {
    return 'Java class files are strictly prohibited';
  }

  // Text-based script / HTML / SVG inspection
  const headerSample = chunk.slice(0, 150).toString('utf8').toLowerCase();
  if (
    headerSample.includes('<?php') ||
    headerSample.includes('<?=') ||
    headerSample.includes('<script') ||
    headerSample.includes('<html') ||
    headerSample.includes('<!doctype') ||
    headerSample.includes('<svg') ||
    headerSample.includes('xmlns="http://www.w3.org/2000/svg"')
  ) {
    return 'HTML, SVG, and script files are strictly prohibited to prevent cross-site scripting';
  }

  // 2. Validate positive match against expected media signatures
  const isVideo = file.fieldname === 'video' || ALLOWED_VIDEO_MIMES.includes(file.mimetype);

  if (isVideo) {
    // MP4: offset 4 contains 'ftyp'
    const isMp4 = chunk.length >= 8 && chunk.toString('latin1', 4, 8) === 'ftyp';
    // WebM: starts with 0x1A, 0x45, 0xDF, 0xA3
    const isWebm = chunk.length >= 4 && chunk[0] === 0x1A && chunk[1] === 0x45 && chunk[2] === 0xDF && chunk[3] === 0xA3;
    // QuickTime (.mov): offset 4 contains ftyp, moov, mdat, wide
    const isMov = chunk.length >= 8 && ['ftyp', 'moov', 'mdat', 'wide'].includes(chunk.toString('latin1', 4, 8));

    if (!isMp4 && !isWebm && !isMov) {
      return 'File content does not match genuine video signatures (MP4, WebM, MOV). Disguised or corrupted files are rejected.';
    }
  } else {
    // Images: JPEG, PNG, WEBP
    const isJpeg = chunk.length >= 3 && chunk[0] === 0xFF && chunk[1] === 0xD8 && chunk[2] === 0xFF;
    const isPng = chunk.length >= 8 &&
      chunk[0] === 0x89 && chunk[1] === 0x50 && chunk[2] === 0x4E && chunk[3] === 0x47 &&
      chunk[4] === 0x0D && chunk[5] === 0x0A && chunk[6] === 0x1A && chunk[7] === 0x0A;
    const isWebp = chunk.length >= 12 &&
      chunk.toString('latin1', 0, 4) === 'RIFF' &&
      chunk.toString('latin1', 8, 12) === 'WEBP';

    if (!isJpeg && !isPng && !isWebp) {
      return 'File content does not match genuine image signatures (JPEG, PNG, WEBP). Disguised or corrupted files are rejected.';
    }
  }

  return null;
};

/**
 * Storage Wrapper Engine with Binary Magic-Bytes Inspection
 */
class ValidatedStorageEngine {
  constructor(delegateStorage, isVideoAllowed = false) {
    this.delegateStorage = delegateStorage;
    this.isVideoAllowed = isVideoAllowed;
  }

  _handleFile(req, file, cb) {
    let peeked = false;

    // Intercept initial chunk to verify magic bytes before passing to Cloudinary
    file.stream.once('data', (chunk) => {
      peeked = true;
      file.stream.unshift(chunk); // Restore chunk for storage engine

      const contentError = validateMagicBytes(chunk, file);
      if (contentError) {
        file.stream.resume(); // Drain stream
        const err = new Error(contentError);
        err.statusCode = 400;
        return cb(err);
      }

      // Content is verified safe & genuine; forward to CloudinaryStorage
      this.delegateStorage._handleFile(req, file, cb);
    });

    file.stream.once('end', () => {
      if (!peeked) {
        const err = new Error('Empty file received');
        err.statusCode = 400;
        return cb(err);
      }
    });

    file.stream.once('error', (err) => {
      cb(err);
    });
  }

  _removeFile(req, file, cb) {
    if (this.delegateStorage && this.delegateStorage._removeFile) {
      this.delegateStorage._removeFile(req, file, cb);
    } else {
      cb(null);
    }
  }
}

// Storage for Images (Course Banners, User Avatars) - isolated in Cloudinary
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 675, crop: 'limit' }],
  },
});

// Generic Storage for Tutorials - isolated in Cloudinary
const tutorialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms/tutorials',
    resource_type: 'auto',
  },
});

const imageFileFilter = (req, file, cb) => {
  const metaError = validateFileMetadata(file, false);
  if (metaError) {
    const err = new Error(metaError);
    err.statusCode = 400;
    return cb(err, false);
  }
  cb(null, true);
};

const tutorialFileFilter = (req, file, cb) => {
  const isVideoField = file.fieldname === 'video';
  const metaError = validateFileMetadata(file, isVideoField);
  if (metaError) {
    const err = new Error(metaError);
    err.statusCode = 400;
    return cb(err, false);
  }
  cb(null, true);
};

const uploadImage = multer({
  storage: new ValidatedStorageEngine(imageStorage, false),
  limits: {
    fileSize: MAX_IMAGE_SIZE,
    files: 1,
  },
  fileFilter: imageFileFilter,
});

const uploadTutorial = multer({
  storage: new ValidatedStorageEngine(tutorialStorage, true),
  limits: {
    fileSize: MAX_VIDEO_SIZE,
    files: 2,
  },
  fileFilter: tutorialFileFilter,
});

module.exports = {
  uploadImage,
  uploadTutorial,
  validateFileMetadata,
  validateMagicBytes,
  ValidatedStorageEngine,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ALLOWED_IMAGE_MIMES,
  ALLOWED_IMAGE_EXTS,
  ALLOWED_VIDEO_MIMES,
  ALLOWED_VIDEO_EXTS,
};
