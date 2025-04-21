//fs for offline local files 


const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000; // Hardcoded port
const DATA_FILE = path.join(__dirname, 'users.json'); // Hardcoded file path
//ex: __dirname will be C:\project\server.
app.use(express.json());

const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading user data:', err.message);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error writing user data:', err.message);
  }
};

app.get('/users', (req, res) => {
  const users = readUsers();
  res.json(users);
});

app.post('/users', (req, res) => {
  const users = readUsers();
  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    name: req.body.name
  };
  users.push(newUser);
  writeUsers(users);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const users = readUsers();
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).send('User not found');

  user.name = req.body.name;
  writeUsers(users);
  res.json(user);
});

app.delete('/users/:id', (req, res) => {
  let users = readUsers();
  const id = parseInt(req.params.id);
  const userExists = users.some(u => u.id === id);
  if (!userExists) return res.status(404).send('User not found');

  users = users.filter(u => u.id !== id);
  writeUsers(users);
  res.send(`User with id ${id} deleted`);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
