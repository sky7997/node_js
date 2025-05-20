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
-------------------------------------------------------------------------------------------------------------------------------------
Q. Create a middleware in Express that checks if a request has an Authorization header. If not, return 401 Unauthorized.

const express = require('express');
const app = express();
const PORT = 5000;
app.use(express.json());
const checkAuthHeader = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized: Authorization header missing' });
    }
    next(); // Pass control to route
  };
  // Apply to specific route
  app.get('/profile', checkAuthHeader, (req, res) => {
    res.send('Welcome to your profile!');
  });
// Server start
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

