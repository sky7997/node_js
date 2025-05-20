Q. Create an Express server with a single POST endpoint /sum that accepts two numbers in the body and returns their sum.
  
const express = require('express');
const app = express();
const PORT = 5000;
// Middleware to parse JSON bodies
app.use(express.json());
// POST /sum endpoint
app.post('/sum', (req, res) => {
  const { num1, num2 } = req.body;
  // Validate inputs
  if (typeof num1 !== 'number' || typeof num2 !== 'number') {
    return res.status(400).json({ error: 'Both num1 and num2 must be numbers' });
  }
  const sum = num1 + num2;
  console.log(sum)
  res.status(201).json({ sum });
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

