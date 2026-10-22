const { v2: cloudinary } = require("cloudinary");
const env = require("../config/env");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

if (env.hasCloudinary) cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });

async function uploadImage(file) {
  if (!file) return { url: null, publicId: null };
  if (env.hasCloudinary) {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "blogify" }, (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      });
      stream.end(file.buffer);
    });
  }
  if (env.isProduction) throw new Error("Image storage is not configured");
  const dir = path.resolve("uploads");
  await fs.mkdir(dir, { recursive: true });
  const ext = file.originalname.toLowerCase().match(/\.(jpg|jpeg|png|webp)$/)?.[0] || ".jpg";
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  await fs.writeFile(path.join(dir, filename), file.buffer);
  return { url: env.SERVER_URL + `/uploads/${filename}`, publicId: null };
}
async function deleteImage(publicId) {
  if (env.hasCloudinary && publicId) await cloudinary.uploader.destroy(publicId).catch(() => {});
}
module.exports = { uploadImage, deleteImage };
