import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Application port
export const PORT: number = parseInt(process.env.PORT ?? "3000", 10);

// Directory that contains original (full-size) images
export const FULL_DIR: string =
  process.env.FULL_DIR || path.join(__dirname, "../full");

// Directory that contains cached/resized thumbnails
export const THUMB_DIR: string =
  process.env.THUMB_DIR || path.join(__dirname, "../thumb");
