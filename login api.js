login-api/
├── node_modules/           # Installed dependencies (auto-created)
├── .env                    # Environment variables (e.g. PORT)
├── .gitignore              # Git ignore file
├── package.json            # Project metadata and dependencies
├── server.js               # Main Express server
├── mockUsers.js            # Mock user data


// mockUsers.js
module.exports = [
  {
    id: 1,
    username: "admin",
    password: "admin123" // plain text for now (NOT for production!)
  },
  {
    id: 2,
    username: "user",
    password: "user123"
  }
];

//server.js file
require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // To parse JSON body

const users = require("./mockUsers"); // Import mock data

// 🧪 Login Route
app.post("/login", async (req, res) => { // didnt used next bcz no need of it here
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Find user in mock database
  const user = await new Promise((resolve)=> resolve( users.find(
    (u) => u.username === username && u.password === password
  )));

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // If matched
  res.status(200).json({
    message: "Login successful",
    user: { id: user.id, username: user.username }
  });
});

// 🏠 Root Route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
