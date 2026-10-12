import { getFunctions, httpsCallable } from 'firebase/functions';
import app from '../firebase/config';

/**
 * Cloudinary Media Service for Client-Side Authenticated Signed Upload
 * NEVER expose API Secret on the client side!
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '';
const API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY || '';
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Upload an image file securely to Cloudinary using Firebase Functions for signing
 * (or direct unsigned upload if VITE_CLOUDINARY_UPLOAD_PRESET is configured)
 * @param {File|Blob} file The file to upload
 * @param {string} folder Target folder on Cloudinary (e.g. 'portfolio/projects')
 * @param {string} resourceType Resource type (e.g., 'auto', 'image', 'raw')
 * @returns {Promise<{ imageUrl: string, publicId: string }>}
 */
export async function uploadToCloudinary(file, folder = 'portfolio', resourceType = 'auto') {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Validate file type
  if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
    throw new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) and PDFs are supported.');
  }

  // Max 10MB file size limit
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('File size exceeds 10MB limit.');
  }

  // Check if Cloudinary is configured
  if (!CLOUD_NAME) {
    console.warn(
      '[Cloudinary] Missing VITE_CLOUDINARY_CLOUD_NAME in .env. Falling back to local preview for development.'
    );
    // Provide a development fallback using FileReader data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          imageUrl: reader.result,
          publicId: `dev-local-${Date.now()}`
        });
      };
      reader.onerror = () => reject(new Error('Failed to read file locally.'));
      reader.readAsDataURL(file);
    });
  }

  // Option A: If an unsigned Upload Preset is configured, upload directly to Cloudinary
  if (UPLOAD_PRESET) {
    try {
      const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      if (folder) formData.append('folder', folder);

      const response = await fetch(url, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
        );
      }

      const result = await response.json();
      return {
        imageUrl: result.secure_url,
        publicId: result.public_id
      };
    } catch (err) {
      console.error('Direct Cloudinary preset upload failed:', err);
      throw err;
    }
  }

  // Option B: Signed upload using Firebase Cloud Function
  if (!API_KEY) {
    throw new Error(
      'Missing VITE_CLOUDINARY_API_KEY. Configure VITE_CLOUDINARY_API_KEY or VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  try {
    // 1. Request signature from Firebase Cloud Functions (explicitly targeting us-central1)
    const functions = getFunctions(app, 'us-central1');
    const getCloudinarySignature = httpsCallable(functions, 'getCloudinarySignature');
    
    // We send the desired folder so the server can validate and sign it.
    const { data } = await getCloudinarySignature({ folder });
    
    const { signature, timestamp } = data;

    if (!signature || !timestamp) {
      throw new Error('Failed to obtain a valid upload signature from the server.');
    }

    // 2. Upload file to Cloudinary with the signature
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', API_KEY);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Cloudinary upload failed with status ${response.status}`
      );
    }

    const result = await response.json();
    return {
      imageUrl: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary securely:', error);
    
    // Provide actionable diagnostic message for common Google Cloud Run / Firebase issues
    if (error?.code === 'functions/internal' || error?.message?.includes('internal')) {
      throw new Error(
        'Cloud Function error: Preflight request failed. In Google Cloud Run Console, grant "Cloud Run Invoker" to "allUsers" for service "getcloudinarysignature", and ensure CLOUDINARY_API_SECRET is set in Secret Manager.'
      );
    }
    
    throw error;
  }
}

/**
 * Generate an optimized Cloudinary delivery URL with automatic format and quality
 */
export function getOptimizedImageUrl(url, width = null, height = null) {
  if (!url || typeof url !== 'string') return url || '';
  if (!url.includes('cloudinary.com')) return url;

  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const transforms = ['f_auto', 'q_auto'];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`, 'c_limit');

  return `${parts[0]}/upload/${transforms.join(',')}/${parts[1]}`;
}
