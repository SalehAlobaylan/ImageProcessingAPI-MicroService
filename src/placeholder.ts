import express from "express";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const placeholder = express.Router();

// I'm gonna add the comments after experimenting somethings firstly :)

// here i extracted the path and store it as a buffer
export const getImageBuffer = (imgPath: string): Buffer => {
  // as you see it returns a type
  return fs.readFileSync(imgPath);
};

// now we want to make sure that the img sizes cached so in this function
// we use basename method to store the name of the path then store it in
// the thumb file with the customized sizes beside it
export const getCachedimgPath = (
  prevPath: string,
  width: number,
  height: number,
): string => {
  // as you see it returns a type
  const fileName = path.basename(prevPath, path.extname(prevPath));
  return path.join(__dirname, "../thumb", `${fileName}-${width}x${height}.jpg`);
};

try {
  // here we going to define a GET route at the path
  placeholder.get("/placeholder", async (req, res): Promise<void> => {
    // as you see it returns a type
    // defining the sizes by using query and setting it 400 by default
    const imgName = req.query.image as string;
    const width = parseInt(req.query.width as string, 10) || 400;
    const height = parseInt(req.query.height as string, 10) || 400;
    if (!imgName) {
      res.status(400).send("Image name is required");
      return;
    }

    const imgPath = path.join(__dirname, "../full", imgName);
    console.log(imgPath); // just testing the path right after defining it

    if (!fs.existsSync(imgPath)) {
      res.status(404).send("Image not found");
      return;
    }

    const cachedimgPath = getCachedimgPath(imgPath, width, height);

    if (fs.existsSync(cachedimgPath)) {
      // Serve the cached image
      res.sendFile(cachedimgPath);
      return;
    }

    //Here storing the image before resizing it
    const imageBuffer = getImageBuffer(imgPath);
    const resizedImage = await sharp(imageBuffer) // using sharp library to resize it
      .resize(width, height)
      .toBuffer(); // i could also change the type of the image here by usimg .jpeg for example
    // but i already have my final type

    fs.writeFileSync(cachedimgPath, resizedImage);

    res.set("Content-Type", "image/jpg"); //tells the client that the content being sent is a JPG image
    res.send(resizedImage);
  });
} catch (error) {
  console.log("Internal Server Error");
}
export default placeholder;
