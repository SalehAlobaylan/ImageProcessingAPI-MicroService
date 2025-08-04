import express from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { FULL_DIR, THUMB_DIR } from "./config";

const placeholder = express.Router();

// Extract the image file into a Buffer so Sharp can manipulate it
export const getImageBuffer = (imgPath: string): Buffer => {
  return fs.readFileSync(imgPath);
};

// Build the cache file path given the original path and requested dimensions & format
export const getCachedimgPath = (
  prevPath: string,
  width: number,
  height: number,
  format: string = "jpg",
): string => {
  const fileName = path.basename(prevPath, path.extname(prevPath));
  return path.join(THUMB_DIR, `${fileName}-${width}x${height}.${format}`);
};

// Allowed output formats mapped to proper MIME types
type OutputFormat = "jpg" | "jpeg" | "png" | "webp";
const formatMime: Record<OutputFormat, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

// GET /placeholder?image=<name>&width=<w>&height=<h>&format=png&quality=90
placeholder.get("/", async (req, res): Promise<void> => {
  const imgName = req.query.image as string;
  const width = parseInt(req.query.width as string, 10) || 400;
  const height = parseInt(req.query.height as string, 10) || 400;
  const requestedFormat = (
    (req.query.format as string) || "jpg"
  ).toLowerCase() as OutputFormat;
  const quality = req.query.quality
    ? parseInt(req.query.quality as string, 10)
    : undefined;

  // Validate mandatory params
  if (!imgName) {
    res.status(400).send("Image name is required");
    return;
  }

  // Validate format
  if (!Object.keys(formatMime).includes(requestedFormat)) {
    res.status(400).send("Unsupported format. Use jpg, png, or webp.");
    return;
  }

  const imgPath = path.join(FULL_DIR, imgName);

  if (!fs.existsSync(imgPath)) {
    res.status(404).send("Image not found");
    return;
  }

  const cachedimgPath = getCachedimgPath(
    imgPath,
    width,
    height,
    requestedFormat,
  );

  // If we already have a cached version with these dimensions/format, serve it directly
  if (fs.existsSync(cachedimgPath)) {
    res.set("Content-Type", formatMime[requestedFormat]);
    res.sendFile(cachedimgPath);
    return;
  }

  try {
    // Resize and cache the new thumbnail
    const imageBuffer = getImageBuffer(imgPath);
    let transformer = sharp(imageBuffer).resize(width, height);

    switch (requestedFormat) {
      case "jpg":
      case "jpeg":
        transformer = transformer.jpeg({ quality: quality ?? 80 });
        break;
      case "png":
        transformer = transformer.png({ quality: quality ?? 80 });
        break;
      case "webp":
        transformer = transformer.webp({ quality: quality ?? 80 });
        break;
    }

    const resizedImage = await transformer.toBuffer();

    fs.writeFileSync(cachedimgPath, resizedImage);

    res.set("Content-Type", formatMime[requestedFormat]);
    res.send(resizedImage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

export default placeholder;
