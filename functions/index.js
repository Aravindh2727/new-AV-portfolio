const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require('firebase-functions/params');
const cloudinary = require("cloudinary").v2;

// Define the Cloudinary API secret to be retrieved from Firebase Secret Manager
const cloudinaryApiSecret = defineSecret("CLOUDINARY_API_SECRET");

// Allowed upload folders to restrict where files can be placed
const ALLOWED_FOLDERS = [
  'portfolio',
  'portfolio/profile',
  'portfolio/projects',
  'portfolio/gallery'
];

exports.getCloudinarySignature = onCall(
  { secrets: [cloudinaryApiSecret] },
  (request) => {
    // 1. Verify caller authentication (must be signed in to the CMS)
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Only authenticated administrators can request an upload signature."
      );
    }

    // Since this ecosystem has a single admin or trusted admins via Firebase Auth,
    // authentication is sufficient authorization according to existing rules.

    const { folder = 'portfolio' } = request.data;

    // 2. Validate folder parameter
    if (!ALLOWED_FOLDERS.includes(folder)) {
      throw new HttpsError(
        "invalid-argument",
        "The requested upload folder is not permitted."
      );
    }

    // 3. Generate signature
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
      },
      cloudinaryApiSecret.value()
    );

    // 4. Return necessary parameters to the client
    return {
      signature,
      timestamp,
      folder
    };
  }
);
