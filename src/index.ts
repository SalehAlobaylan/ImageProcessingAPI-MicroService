import express from 'express';
import route from './Routes/Routes';

// primary endpoint
const app = express();
const port = 3000;

//Start express server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Set up Routes
  app.get('/placeholder', route);
});

// Exporting app to use it in the unit testing
export default app; 



//     Here to use the API and test it
// http://localhost:3000/placeholder?image=DMASO1.jpg&width=400&height=400