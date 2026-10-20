import api from './api';
import axios from 'axios';

/**
 * Uploads media (images or videos) directly to Cloudinary using signed authentication tokens.
 * This completely bypasses the backend Node.js container memory (protecting the 512MB RAM limit).
 * 
 * @param {File} file - The file object to upload
 * @param {string} folder - Destination folder on Cloudinary (default: 'lms/tutorials')
 * @param {function} onProgress - Optional callback function (percentage: number)
 * @returns {Promise<string>} The secure HTTPS URL of the uploaded asset
 */
export const uploadDirectToCloudinary = async (file, folder = 'lms/tutorials', onProgress = null) => {
  // Step 1: Request signed authorization params from backend
  const { data: sigData } = await api.post('/cloudinary/signature', { folder });
  const { signature, timestamp, apiKey, cloudName, folder: targetFolder } = sigData;

  // Step 2: Prepare FormData for Cloudinary's upload API
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', targetFolder);

  // Step 3: Stream file directly from client browser to Cloudinary CDN
  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
  const response = await axios.post(uploadUrl, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });

  return response.data.secure_url;
};

export default uploadDirectToCloudinary;
