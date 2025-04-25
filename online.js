//env for database connection

├── node_modules/           # Installed dependencies (auto-created)
├── .gitignore              # Git ignore file
├── package.json            # Project metadata and dependencies
├── server.js               # Main Express server
├── mockData.js            # Mock user data

//mockData.js file
module.exports = [
    { id: 1, name: "rcb", unit: 200 },
    { id: 2, name: "csk", unit: 200 },
    { id: 3, name: "kkr", unit: 200 },
    { id: 4, name: "srh", unit: 200 },
  ];

//server.js file
const express = require("express");
const cors = require('cors'); // Import cors
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); // Enable CORS //cors that allows browsers to make requests to a server on a different domain (or port) 
app.use(express.json());
let users=require("./mockData")

// GET root endpoint
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// GET all users
app.get("/users", async (req, res, next) => {
  try {
    // Simulate async operation (e.g., database call)
    const allUsers = await new Promise((resolve) => resolve(users)); 
    res.json(allUsers);
  } catch (err) {
    next(err);
  }
}); // to check the users add "/users" to http://localhost:5000/ like http://localhost:5000/users in chrome


// POST a user
app.post("/users", async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Simulate async operation (e.g., saving to a database)
    const newUser = {
      id: users.length + 1,
      name,
      unit: 200,
    };

    // Simulate async database save
    await new Promise((resolve) => users.push(newUser));
    // here we didnt used resolve in return becuase we dont need we can simply write users.push(newUser)
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

// PUT update user name
app.put("/users/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    // Simulate async operation (e.g., fetching from a database)
    const user = await new Promise((resolve) => users.find((u) => u.id === id));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Simulate async operation (e.g., updating the database)
    user.name = name;
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// DELETE a user
app.delete("/users/:id", async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    // Simulate async operation (e.g., checking in a database)
    const userExists = await new Promise((resolve) =>
      resolve(users.some((u) => u.id === id))
    );
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Simulate async operation (e.g., deleting from a database)
    users = await new Promise((resolve) => resolve(users.filter((u) => u.id !== id)));
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


