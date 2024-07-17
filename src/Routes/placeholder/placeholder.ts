import express from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const placeholder = express.Router();


// I'm gonna add the comments after experimenting somethings firstly :)

// here i extracted the path and store it as a buffer
const getImageBuffer = (imgPath: string): Buffer => {
  return fs.readFileSync(imgPath);
};


// now we want to make sure that the img sizes cached so in this function 
// we use basename method to store the name of the path then store it in
// the thumb file with the customized sizes beside it 
const getCachedimgPath = (prevPath: string, width: number, height: number): string => {
  const fileName = path.basename(prevPath, path.extname(prevPath));
  return path.join(__dirname, 'thumb', `${fileName}-${width}x${height}.jpg`);
};

// here we going to define a GET route at the path
placeholder.get('/placeholder', async (req, res) => {

  // defining the sizes by using query and setting it 400 by default
  const width = parseInt(req.query.width as string, 10) || 400;
  const height = parseInt(req.query.height as string, 10) || 400;

  const imgPath = path.join(__dirname, 'full', 'DMASO2.jpg'); 
  console.log(imgPath); // just testing the path right after defining it
  
        if (!fs.existsSync(imgPath)) {
          return res.status(404).send('Image not found');
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
  
  res.set('Content-Type', 'image/jpg'); //tells the client that the content being sent is a JPG image
  res.send(resizedImage);
  
  
});

export default placeholder;