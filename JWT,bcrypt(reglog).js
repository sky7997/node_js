//server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const users = require("./mockData");

const app = express();
const port = 5000;
const SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // your frontend origin
  credentials: true
}));

// Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

// Register
app.post("/users", (req, res) => {
  const user = req.body;
  users.push(user);
  res.status(201).json(user);
});

// Login with JWT + Cookie
app.post("/users/loginn", (req, res) => {
  const { username, password } = req.body;
  const found = users.find(u => u.username === username && u.password === password);
  if (!found) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username }, SECRET, { expiresIn: "1d" });

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
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
