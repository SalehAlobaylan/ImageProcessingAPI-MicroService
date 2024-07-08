import { Request, Response } from 'express';
import sharp from 'sharp';
import path from 'path';

// I'm gonna add the comments after experimenting somethings firstly :)

export const placeholder = async (req: Request, res: Response) => {
  const width = parseInt(req.query.width as string, 10) || 300;
  const height = parseInt(req.query.height as string, 10) || 300;

  const imagePath = req.query.image as string;

  const fullImagePath = path.join(__dirname, '..', 'images', imagePath);

  const image = await sharp(fullImagePath)
        .resize(width, height)
        .toBuffer();

      res.set('Content-Type', 'image/png');
      res.send(image);





};

export default placeholder;