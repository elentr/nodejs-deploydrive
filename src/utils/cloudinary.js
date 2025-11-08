import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadToCloudinary = async file => {
  const res = await cloudinary.v2.uploader.upload(file.path);
  await fs.unlink(file.path);
  return res.secure_url;
};
