import { v2 as cloudinary } from "cloudinary";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  configured = true;
}

/**
 * Upload a base64 data URL (or remote URL) to Cloudinary, returning the secure URL + public_id.
 */
export async function uploadToCloudinary(
  source: string,
  folder = "daveelectrical/certificates",
): Promise<{ url: string; publicId: string; format?: string; bytes?: number }> {
  ensureConfigured();
  const res = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: "auto",
  });
  return {
    url: res.secure_url,
    publicId: res.public_id,
    format: res.format,
    bytes: res.bytes,
  };
}

export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
