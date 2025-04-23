//Q. write a node.js/express API endpoint to fetch all open tickets
// from an array(mock data) use async/await

require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Mock Data (Array of tickets)
let tickets = [
  { id: 1, name: "rcb", unit: 200, toggle: true },
  { id: 2, name: "csk", unit: 200, toggle: false },
  { id: 3, name: "kkr", unit: 200, toggle: true },
  { id: 4, name: "srh", unit: 200, toggle: false },
];

// Async function to simulate fetching data
const getOpenTickets = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const openTickets = tickets.filter((ticket) => ticket.toggle);
      resolve(openTickets);
    }, 1000); // Simulate a delay (1 second)
  });
};
//async: Marks the function as asynchronous, meaning it returns a promise and can use await inside.
//new Promise(...): This creates a new Promise object, which is used to handle async work (e.g., something that takes time).
//resolve: This is a function you call when your async task is done, and you want to return a result.
//We used the 1-second delay (setTimeout) just to simulate a real-world delay, like a call to a database, API, or some slow external service.
//1 sec delay It’s only there to act like a "fake delay" for testing purposes — it's not because await needs a delay to work.


// Route to fetch all open tickets
app.get("/tickets/open", async (req, res) => {
  try {
    const openTickets = await getOpenTickets(); // await:async functions to pause execution until a Promise is resolved.
    res.status(200).json(openTickets); // Send response as JSON
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Unable to fetch open tickets" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
