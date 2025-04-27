//Frontend
import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [task, setTask] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState(null); // State to store error

  // Fetch existing tickets from the backend on component mount
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data from the server");
        }
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message); // Set error state
      });
  }, []);

  // Function to add a new ticket
  const addOperation = () => {
    if (!task.trim()) return;

    const newTicket = {
      name: task,
      unit: 200,
      toggle: true,
    };

    // POST the new ticket to the backend
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTicket),
    })
      .then((res) => res.json())
      .then((newTicket) => {
        setData((prev) => [...prev, newTicket]); // Update local state with new ticket
        setTask(""); // Clear input field
      })
      .catch((err) => {
        console.error("Add error:", err);
        setError("Failed to add ticket"); // Set error state
      });
  };

  // Function to toggle a ticket's open/closed status
  const editOper = (id) => {
    const targetTicket = data.find((item) => item.id === id);
    if (!targetTicket) return;

    const updatedTicket = { ...targetTicket, toggle: !targetTicket.toggle };

    // PUT request to update the ticket's status
    fetch(`http://localhost:5000/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTicket),
    })
      .then((res) => res.json())
      .then((updatedTicket) => {
        // Update state with the updated ticket status
        setData((prev) =>
          prev.map((item) => (item.id === id ? updatedTicket : item))
        );
      })
      .catch((err) => {
        console.error("Update error:", err);
        setError("Failed to update ticket status"); // Set error state
      });
  };

  // Filter open and closed tickets based on the `toggle` status
  const openTickets = data.filter((ticket) => ticket.toggle);
  const closedTickets = data.filter((ticket) => !ticket.toggle);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add a Ticket</h2>
      <input
        placeholder="Add ticket"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addOperation}>Add</button>

      {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Display error message */}

      <div style={{ marginTop: "30px" }}>
        <h2>Open Tickets</h2>
        <ul>
          {openTickets.map((item) => (
            <li
              onClick={() => editOper(item.id)}
              key={item.id}
              style={{ cursor: "pointer" }}
            >
              {item.name} - Open
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h2>Closed Tickets</h2>
        <ul>
          {closedTickets.map((item) => (
            <li
              onClick={() => editOper(item.id)}
              key={item.id}
              style={{ cursor: "pointer" }}
            >
              {item.name} - Closed
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;


//Backend
//mockData.js
module.exports = [
    { id: 1, name: "rcb", unit: 200, toggle: true },
  { id: 2, name: "csk", unit: 200, toggle: true },
  { id: 3, name: "kkr", unit: 200, toggle: true },
  { id: 4, name: "srh", unit: 200, toggle: true },
  ];
//server.js
const express = require("express");
const cors = require("cors");
const mockData = require("./mockData"); // Import the mock data

const app = express();
const port = 5000;

app.use(cors()); // Allow CORS for frontend requests
app.use(express.json()); // Middleware to parse JSON request body

// GET request to fetch users (tickets) from mock data
app.get("/users", (req, res) => {
  res.json(mockData);
});

// POST request to add a new ticket to the mock data
app.post("/users", (req, res) => {
  const newTicket = req.body;
  const newTicketId = mockData.length ? mockData[mockData.length - 1].id + 1 : 1; // Generate a new ID
  const addedTicket = { ...newTicket, id: newTicketId };
  mockData.push(addedTicket); // Add new ticket to the mock data
  res.status(201).json(addedTicket); // Return the added ticket
});

// PUT request to update a ticket's status
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedTicket = req.body;
  
  // Find the ticket and update it
  const index = mockData.findIndex((ticket) => ticket.id === parseInt(id));
  
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...updatedTicket };
    res.json(mockData[index]); // Return the updated ticket
  } else {
    res.status(404).json({ message: "Ticket not found" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
