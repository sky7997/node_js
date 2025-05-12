//server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");

const app = express();
const port = 5000;
const SECRET = process.env.JWT_SECRET || "secret"; // fallback if not in .env

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // your frontend origin
  credentials: true
}));

const users = []; // Still using in-memory for demo

// Get all users (optional, for testing)
app.get("/users", (req, res) => {
  res.json(users.map(u => ({ username: u.username }))); // hide passwords
});

// Register
app.post("/users", async (req, res) => {
  const { username, password } = req.body;
  const exists = users.find(u => u.username === username);
  if (exists) return res.status(400).json({ error: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: "User created" });
});

// Login with JWT + bcrypt
app.post("/users/loginn", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production"
  });

  res.json({ message: "Login successful" });
});

// Protected route
app.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(403).json({ error: "No token" });

  try {
    const user = jwt.verify(token, SECRET);
    res.json({ message: "Protected content", user });
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


----------------------------------------------------------------
// App.js
import React, { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState("login");

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then(res => res.json())
      .then(dat => setData(dat));

    // Check if already logged in
    fetch("http://localhost:5000/protected", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setMsg(`Welcome back, ${data.user.username}`);
        }
      });
  }, []);

  const regF = () => {
    if (!username || !password) return;
    const exists = data.find(t => t.username === username);
    if (exists) {
      setMsg("User already exists");
      return;
    }
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(newUser => {
        setData(prev => [...prev, newUser]);
        setPage("login");
        setUsername("");
        setPassword("");
        setMsg("Registration successful");
      });
  };

  const logF = () => {
    if (!username || !password) return;
    fetch("http://localhost:5000/users/loginn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setMsg(data.error);
        } else {
          setMsg("Login successful");
          setUsername("");
          setPassword("");
        }
      });
  };

  const logout = () => {
    fetch("http://localhost:5000/logout", {
      method: "POST",
      credentials: "include"
    }).then(() => setMsg("Logged out"));
  };

  const switchToRegister = () => setPage("register");

  return (
    <div>
      {page === "login" ? <h2>Login</h2> : <h2>Register</h2>}
      <input
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {page === "login" ? (
        <button onClick={logF}>Login</button>
      ) : (
        <button onClick={regF}>Register</button>
      )}
      <button onClick={switchToRegister}>Switch to Register</button>
      <button onClick={logout}>Logout</button>
      <p>{msg}</p>
    </div>
  );
};

export default App;
