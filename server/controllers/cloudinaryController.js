const cloudinary = require('../config/cloudinary');

/**
 * @desc    Generate signed Cloudinary upload params for direct-from-browser uploads
 * @route   POST /api/cloudinary/signature
 * @access  Private/Admin
 */
const getUploadSignature = async (req, res) => {
  try {
    const ALLOWED_FOLDERS = ['lms/tutorials', 'lms/images', 'lms/materials'];
    const requestedFolder = req.body.folder || 'lms/tutorials';
    const folder = ALLOWED_FOLDERS.includes(requestedFolder) ? requestedFolder : 'lms/tutorials';
    
    // Parameters to sign
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    });
  } catch (error) {
    console.error('Cloudinary Signature Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate upload signature' });
  }
};

module.exports = {
  getUploadSignature,
};
