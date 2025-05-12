//Q. write a node.js/express API endpoint to fetch all open tickets
// from an array(mock data) use async/await
//mockData.js
const dummyItems = [
  { name: "Laptop", price: "75000", location: "Bangalore", phno: "9876543210", carted: false },
  { name: "Phone", price: "30000", location: "Chennai", phno: "9123456780", carted: true },
  { name: "Headphones", price: "2500", location: "Delhi", phno: "9988776655", carted: false },
  { name: "Keyboard", price: "1500", location: "Mumbai", phno: "8888666622", carted: true },
  { name: "Monitor", price: "12000", location: "Hyderabad", phno: "9001122334", carted: false }
];
//server.js
module.exports=dummyItems
require("dotenv").config()
const express = require("express");
const cors = require("cors");
const mockData = require("./mockData"); // Import the mock data
const mongoose=require("mongoose")
const app = express();
const port = 5000;

app.use(cors()); // Allow CORS for frontend requests
app.use(express.json()); // Middleware to parse JSON request body
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected momgodb"))
.catch(err=>console.error("server issue",err))

app.get("/opendats", async (req,res)=>{
  try{
    const data= await mockData.filter(t=>!t.carted) // u using mockdata not original momgodb thts why using filter 
  res.json(data)                                    //instead of find({carted:false})
  }
  catch(err){
    res.status(501).json({error:"servre error"})
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
