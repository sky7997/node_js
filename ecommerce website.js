//components/home
import React,{useState,useEffect} from "react"
import Products from "./products"
const Home=()=>{
  const [adat,setDataa]=useState([])
  const [bdat,setDatab]=useState([])
  const [cdat,setDatac]=useState([])

  useEffect(() => {
    fetch("http://localhost:5000/data")
      .then(res => res.json())
      .then(dat => {
        const a = dat.alist
        const b = dat.blist
        const c = dat.clist
        setDataa(a);
        setDatab(b);
        setDatac(c);
      });
  }, []);
  


const addCartF=(id)=>{
const fnd=adat.find(t=>t.id===id) || bdat.find(t=>t.id===id) || cdat.find(t=>t.id===id)
const newdata={name:fnd.name, price:fnd.price}
fetch("http://localhost:5000/newdata",{
  method:"POST",
  headers:{
    "Content-Type":"application/json"
  },
  body:JSON.stringify(newdata)
})

}
return (
  <div>
{adat.map(dat=>(
  <div key={dat.id}>
    <Products 
data={dat}
addCart={addCartF}
/>
    </div>
))}
{bdat.map(dat=>(
  <div key={dat.id}>
    <Products 
data={dat}
addCart={addCartF}
/>
    </div>
))}
{cdat.map(dat=>(
  <div key={dat.id}>
    <Products 
data={dat}
addCart={addCartF}
/>
    </div>
))}
  </div>
)
}
export default Home

//componnets/cart
import React,{useState,useEffect} from "react"

const Cart=()=>{
    const [newdat,setNewdat]=useState([])
useEffect(()=>{
    fetch("http://localhost:5000/newdata")
    .then(res=>res.json())
    .then(dat=>setNewdat(dat))
},[])
const addCartD=(id)=>{
    
        fetch(`http://localhost:5000/newdata/:${id}`,{
          method:"DELETE",
          
        })
        .then((res) => res.json())
      .then(() => {
        // Remove item from state after deletion
        setNewdat((prev) => prev.filter((item) => item.id !== id));
      });
}
return (
        <div>
          {newdat.map(data=>(
            <div key={data.id}>
            <p>{data.name}</p>
            <p>{data.price}</p>
            <button onClick={()=>addCartD(data.id)}>remove</button>
            </div>
          ))}
        </div>
      )
}
export default Cart
//componnets/navbar
import React from "react";
import {Link} from "react-router-dom";

const Navbar = () => {
  return (
    <div>
    <nav>
      <Link to="/" >Home</Link>
      <Link to="/cart" >Cart</Link>
    </nav>
    </div>
  );
};
export default Navbar
//components/products
import React from "react"
const Products=({data,addCart})=>{
  return (
    <div>
      <p>{data.name}</p>
      <p>{data.price}</p>
      <button onClick={()=>addCart(data.id)}>Add</button>
    </div>
  )
}
export default Products
//App.js
import React from "react"
import Cart from "./components/cart.js"
import Home from "./components/home"
import Navbar from "./components/navbar" 
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
const App=()=>{
    return (
        <Router>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="cart" element={<Cart/>}/>
            </Routes>
        </Router>
    )
}
export default App
//server.js
const express = require("express");
const cors = require("cors");
const app = express();
const cartdata = require("./reglogdata"); // Import the cart data from reglogdat.js
app.use(express.json());
app.use(cors());

const { alist, blist, clist } = require("./cofvenddata");
const port = 5000;
app.get("/",(req,res)=>{
  res.json("server running")
})
// Route to get product data
app.get("/data", (req, res) => {
  res.json({ alist, blist, clist });
});

// Route to add new item to cart
app.post("/newdata", (req, res) => {
  const dat = req.body;
  const newid = cartdata.length ? cartdata[cartdata.length - 1].id + 1 : 1;
  cartdata.push({ ...dat, id: newid });
  res.json(cartdata); // Return updated cart data
});

// Route to delete item from cart by ID
app.delete("/newdata/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = cartdata.findIndex(t => t.id === id);
  if (index !== -1) {
    cartdata.splice(index, 1); // Remove item by ID
    res.send("deleted"); // Return success message
  } else {
    res.status(404).send("Item not found"); // Return error if item not found
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
