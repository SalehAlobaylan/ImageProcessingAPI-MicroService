import express from "express";
import route from "./Routes";
import { PORT } from "./config";

// primary endpoint
const app = express();

// Register routes before starting the server
app.use(route);

// Start express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Exporting app to use it in the unit testing
export default app;

//     Here to use the API and test it
// http://localhost:3000/placeholder?image=DMASO1.jpg&width=400&height=400
