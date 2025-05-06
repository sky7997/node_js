//structure
models
  todosdata
.env
server.js

//todosdata
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  todo: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });//timestamps for time creation actually not nneeded u can remove it

module.exports = mongoose.model("Todo", todoSchema);

//server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Todo = require("./models/User"); // Adjust path as needed

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("Connection error:", err));

// Routes
app.get("/", (req, res) => {
  res.json("Server running");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Get all users
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.send(`User ${req.params.id} deleted`);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

