require("dotenv").config();

const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8000),
  MONGO_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  CLIENT_URL: z.string().url(),
  SERVER_URL: z.string().url().default("http://localhost:8000"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  MAX_UPLOAD_MB: z.coerce.number().positive().default(5)
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment configuration:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;
env.isProduction = env.NODE_ENV === "production";
env.hasCloudinary = Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET);

if (env.isProduction && !env.hasCloudinary) {
  console.error("CLOUDINARY_* variables are required in production.");
  process.exit(1);
}

module.exports = env;
