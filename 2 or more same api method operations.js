//just example
const express = require("express");
const app = express();

app.use(express.json()); // To parse JSON bodies

// Sample data
let users = [
    { id: "1", name: "Alice", age: 25 },
    { id: "2", name: "Bob", age: 30 }
];

let posts = [
    { id: "101", title: "Hello World", content: "This is a post" },
    { id: "102", title: "Second Post", content: "Another one" }
];

// PUT route for users
app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        return res.json(users[index]);
    }

    res.status(404).json({ message: "User not found" });
});

// PUT route for posts
app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const index = posts.findIndex(post => post.id === id);

    if (index !== -1) {
        posts[index] = { ...posts[index], ...updates };
        return res.json(posts[index]);
    }

    res.status(404).json({ message: "Post not found" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
