//env for database connection

require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

let users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Alice' }
];

// GET all users
app.get('/users', (req, res, next) => {
  try {
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// POST a new user
app.post('/users', (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const newUser = {
      id: users.length + 1,
      name
    };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// PUT update user
app.put('/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const user = users.find(u => u.id === id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.name = name;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE a user
app.delete('/users/:id', (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userExists = users.some(u => u.id === id);

    if (!userExists) {
      return res.status(404).json({ error: 'User not found' });
    }

    users = users.filter(u => u.id !== id);
    res.send(`User with id ${id} deleted`);
  } catch (err) {
    next(err);
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unexpected Error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server' });
}); //console.error() Logs errors (usually in red),error inbulit word
//console.error logs the error to the server's console for debugging purposes.
//res.status(500).json(...) sends a generic error message to the client, without exposing sensitive details.
// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
