import express from 'express';
import route from './Routes/Routes';
import path from 'path';


// primary endpoint
const app = express();
const port = 3000;

app.use('/Images', express.static(path.join(__dirname, 'Images')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'images', 'DMASO2.png'));
  
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  // Set up Routes
app.get('placeholder', route);
});