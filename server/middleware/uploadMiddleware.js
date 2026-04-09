const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Storage for Images (Course Banners, User Avatars)
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms/images',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1200, height: 675, crop: 'limit' }],
  },
});

// Generic Storage for Tutorials (handle both image thumbnails and video content)
const tutorialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'lms/tutorials',
    resource_type: 'auto', // Important: allows both video and image
  },
});

const uploadImage = multer({ storage: imageStorage });
const uploadTutorial = multer({ storage: tutorialStorage });

module.exports = {
  uploadImage,
  uploadTutorial,
};
