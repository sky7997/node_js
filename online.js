//env for database connection

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

let users = [
  { id: 1, name: "rcb", unit: 200 },
  { id: 2, name: "csk", unit: 200 },
  { id: 3, name: "kkr", unit: 200 },
  { id: 4, name: "srh", unit: 200 },
];

// Root route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// GET all users
app.get("/users", (req, res, next) => {
  try {
    res.json(users);
  } catch (err) {
    next(err);
  }
}); // to check the users add "/users" to http://localhost:5000/ like http://localhost:5000/users in chrome

// POST a user
app.post("/users", (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const newUser = {
      id: users.length + 1,
      name,
      unit: 200,
    };

    users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// PUT update user name
app.put("/users/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const user = users.find((u) => u.id === id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.name = name;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE a user
app.delete("/users/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userExists = users.some((u) => u.id === id);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    users = users.filter((u) => u.id !== id);
    res.send(`User with ID ${id} deleted`);
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ error: "Server problem" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
// to check the users add "/users" to http://localhost:5000/ like http://localhost:5000/users in chrome
