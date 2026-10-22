const { test, describe } = require('node:test');
const assert = require('node:assert');
const {
  validateFileMetadata,
  validateMagicBytes,
  MAX_IMAGE_SIZE,
  MAX_VIDEO_SIZE,
  ALLOWED_IMAGE_MIMES,
  ALLOWED_IMAGE_EXTS,
  ALLOWED_VIDEO_MIMES,
  ALLOWED_VIDEO_EXTS,
} = require('../middleware/uploadMiddleware');
const { cloudinarySignatureSchema } = require('../validators/schemas');

describe('File Upload Security & Content Validation Suite', () => {
  // --- 1. FILE TYPE & EXTENSION WHITELIST VALIDATION ---
  describe('1. File Type & Extension Whitelisting', () => {
    test('Accepts compliant image file metadata (.jpg, .jpeg, .png, .webp)', () => {
      const validCases = [
        { originalname: 'avatar.jpg', mimetype: 'image/jpeg' },
        { originalname: 'banner.jpeg', mimetype: 'image/jpeg' },
        { originalname: 'photo.png', mimetype: 'image/png' },
        { originalname: 'graphic.webp', mimetype: 'image/webp' },
      ];

      for (const file of validCases) {
        const error = validateFileMetadata(file, false);
        assert.strictEqual(error, null, `Should accept valid image metadata: ${file.originalname}`);
      }
    });

    test('Accepts compliant video file metadata (.mp4, .webm, .mov) when video is allowed', () => {
      const validCases = [
        { originalname: 'lecture.mp4', mimetype: 'video/mp4' },
        { originalname: 'demo.webm', mimetype: 'video/webm' },
        { originalname: 'recording.mov', mimetype: 'video/quicktime' },
      ];

      for (const file of validCases) {
        const error = validateFileMetadata(file, true);
        assert.strictEqual(error, null, `Should accept valid video metadata: ${file.originalname}`);
      }
    });

    test('Rejects dangerous and executable file extensions (.php, .exe, .sh, .bat, .svg, .html)', () => {
      const dangerousFiles = [
        { originalname: 'webshell.php', mimetype: 'image/jpeg' },
        { originalname: 'malware.exe', mimetype: 'image/png' },
        { originalname: 'script.sh', mimetype: 'image/jpeg' },
        { originalname: 'payload.bat', mimetype: 'image/png' },
        { originalname: 'xss_vector.svg', mimetype: 'image/svg+xml' },
        { originalname: 'phishing.html', mimetype: 'text/html' },
        { originalname: 'macro.vbs', mimetype: 'image/jpeg' },
        { originalname: 'package.jar', mimetype: 'application/java-archive' },
      ];

      for (const file of dangerousFiles) {
        const error = validateFileMetadata(file, false);
        assert.ok(error, `Must reject dangerous extension: ${file.originalname}`);
      }
    });

    test('Rejects double extension attacks (e.g., shell.php.jpg or exploit.exe.png)', () => {
      const doubleExtensionCases = [
        { originalname: 'shell.php.jpg', mimetype: 'image/jpeg' },
        { originalname: 'trojan.exe.png', mimetype: 'image/png' },
        { originalname: 'script.sh.webp', mimetype: 'image/webp' },
        { originalname: 'hack.html.jpeg', mimetype: 'image/jpeg' },
        { originalname: 'exploit.svg.jpg', mimetype: 'image/jpeg' },
      ];

      for (const file of doubleExtensionCases) {
        const error = validateFileMetadata(file, false);
        assert.ok(error, `Must reject double extension: ${file.originalname}`);
        assert.ok(
          error.includes('Dangerous secondary extension') || error.includes('forbidden'),
          `Error must identify secondary extension: ${error}`
        );
      }
    });

    test('Rejects path traversal and null bytes in filenames', () => {
      const maliciousNames = [
        { originalname: '../../etc/passwd.jpg', mimetype: 'image/jpeg' },
        { originalname: '..\\..\\windows\\system32.png', mimetype: 'image/png' },
        { originalname: 'valid.jpg\0.php', mimetype: 'image/jpeg' },
        { originalname: '/var/www/uploads/shell.jpg', mimetype: 'image/jpeg' },
      ];

      for (const file of maliciousNames) {
        const error = validateFileMetadata(file, false);
        assert.ok(error, `Must reject path traversal filename: ${file.originalname}`);
      }
    });

    test('Rejects mismatched or disallowed MIME types even with valid extension', () => {
      const mismatchedCases = [
        { originalname: 'image.jpg', mimetype: 'application/x-php' },
        { originalname: 'image.png', mimetype: 'text/html' },
        { originalname: 'image.webp', mimetype: 'application/octet-stream' },
        { originalname: 'image.jpg', mimetype: 'image/svg+xml' },
      ];

      for (const file of mismatchedCases) {
        const error = validateFileMetadata(file, false);
        assert.ok(error, `Must reject disallowed MIME type: ${file.mimetype}`);
      }
    });
  });

  // --- 2. FILE SIZE CONSTRAINTS ---
  describe('2. File Size Enforcement Limits', () => {
    test('Configures strict max limits for image and video uploads', () => {
      assert.strictEqual(MAX_IMAGE_SIZE, 5 * 1024 * 1024, 'Max image size must be 5MB');
      assert.strictEqual(MAX_VIDEO_SIZE, 50 * 1024 * 1024, 'Max video size must be 50MB');
      assert.ok(ALLOWED_IMAGE_EXTS.length >= 3);
      assert.ok(ALLOWED_VIDEO_EXTS.length >= 3);
    });
  });

  // --- 3. BINARY CONTENT & MAGIC BYTES VALIDATION ---
  describe('3. Binary Content & Magic-Bytes Validation', () => {
    test('Accepts genuine JPEG magic bytes (FF D8 FF)', () => {
      const jpegHeader = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46]);
      const file = { fieldname: 'thumbnail', mimetype: 'image/jpeg' };

      const error = validateMagicBytes(jpegHeader, file);
      assert.strictEqual(error, null, 'Must accept genuine JPEG binary header');
    });

    test('Accepts genuine PNG magic bytes (89 50 4E 47 0D 0A 1A 0A)', () => {
      const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00]);
      const file = { fieldname: 'avatar', mimetype: 'image/png' };

      const error = validateMagicBytes(pngHeader, file);
      assert.strictEqual(error, null, 'Must accept genuine PNG binary header');
    });

    test('Accepts genuine WEBP magic bytes (RIFF....WEBP)', () => {
      const webpHeader = Buffer.concat([
        Buffer.from('RIFF', 'ascii'),
        Buffer.from([0x24, 0x00, 0x00, 0x00]),
        Buffer.from('WEBP', 'ascii'),
      ]);
      const file = { fieldname: 'thumbnail', mimetype: 'image/webp' };

      const error = validateMagicBytes(webpHeader, file);
      assert.strictEqual(error, null, 'Must accept genuine WEBP binary header');
    });

    test('Accepts genuine MP4 video magic bytes (ftyp at offset 4)', () => {
      const mp4Header = Buffer.concat([
        Buffer.from([0x00, 0x00, 0x00, 0x18]),
        Buffer.from('ftypisom', 'ascii'),
      ]);
      const file = { fieldname: 'video', mimetype: 'video/mp4' };

      const error = validateMagicBytes(mp4Header, file);
      assert.strictEqual(error, null, 'Must accept genuine MP4 video header');
    });

    test('Accepts genuine WebM video magic bytes (1A 45 DF A3)', () => {
      const webmHeader = Buffer.from([0x1A, 0x45, 0xDF, 0xA3, 0x9F, 0x42, 0x86, 0x81]);
      const file = { fieldname: 'video', mimetype: 'video/webm' };

      const error = validateMagicBytes(webmHeader, file);
      assert.strictEqual(error, null, 'Must accept genuine WebM video header');
    });

    test('Rejects PHP scripts disguised as images (.jpg with <?php content)', () => {
      const fakeJpeg = Buffer.from('<?php echo system($_GET["cmd"]); ?>');
      const file = { fieldname: 'avatar', mimetype: 'image/jpeg' };

      const error = validateMagicBytes(fakeJpeg, file);
      assert.ok(error, 'Must reject disguised PHP script');
      assert.ok(error.includes('prohibited') || error.includes('signatures'), 'Error must flag invalid content');
    });

    test('Rejects Windows PE / DLL executables (MZ signature) disguised as images', () => {
      const fakeImageExe = Buffer.from([0x4D, 0x5A, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
      const file = { fieldname: 'thumbnail', mimetype: 'image/png' };

      const error = validateMagicBytes(fakeImageExe, file);
      assert.ok(error, 'Must reject Windows executable binary');
      assert.ok(error.includes('Executable files'), 'Error must specify executable files');
    });

    test('Rejects Linux ELF binaries (\\x7fELF signature) disguised as media', () => {
      const fakeMediaElf = Buffer.from([0x7F, 0x45, 0x4C, 0x46, 0x02, 0x01, 0x01, 0x00]);
      const file = { fieldname: 'video', mimetype: 'video/mp4' };

      const error = validateMagicBytes(fakeMediaElf, file);
      assert.ok(error, 'Must reject Linux ELF binary');
      assert.ok(error.includes('Binary executable files'), 'Error must specify binary executable');
    });

    test('Rejects HTML and SVG payloads containing script tags (preventing Stored XSS)', () => {
      const svgPayload = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
      const file = { fieldname: 'avatar', mimetype: 'image/jpeg' };

      const error = validateMagicBytes(svgPayload, file);
      assert.ok(error, 'Must reject SVG payload disguised as JPEG');
      assert.ok(error.includes('cross-site scripting') || error.includes('signatures'));
    });

    test('Rejects empty or 0-byte file chunks', () => {
      const emptyBuffer = Buffer.alloc(0);
      const file = { fieldname: 'thumbnail', mimetype: 'image/jpeg' };

      const error = validateMagicBytes(emptyBuffer, file);
      assert.ok(error, 'Must reject empty file');
      assert.strictEqual(error, 'Uploaded file is empty');
    });
  });

  // --- 4. CLOUDINARY DIRECT UPLOAD SECURITY & STORAGE ISOLATION ---
  describe('4. Storage Isolation & Upload Signature Protection', () => {
    test('Cloudinary signature generation strictly enforces allowed destination folders', () => {
      const allowed = ['lms/tutorials', 'lms/images', 'lms/materials'];
      for (const folder of allowed) {
        const parsed = cloudinarySignatureSchema.safeParse({ folder });
        assert.strictEqual(parsed.success, true, `Should accept allowed folder: ${folder}`);
      }

      const disallowed = ['../../etc/passwd', 'system/root', 'malicious/folder', 'public/scripts'];
      for (const folder of disallowed) {
        const parsed = cloudinarySignatureSchema.safeParse({ folder });
        assert.strictEqual(parsed.success, false, `Should reject unwhitelisted folder: ${folder}`);
      }
    });
  });
});
