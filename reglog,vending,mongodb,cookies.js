//to add cookies we dont need to change backend
//frntend structure
src
  components
    Reglog.js
    Cofvendmac.js
  App.js

//files
//Reglog.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // <-- add this line

const Reglog = ({ onLogging }) => {
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState("login");

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((dat) => setData(dat));
  }, []);

  const regF = () => {
    if (!username || !password) return;
    const fnd = data.find((t) => t.username === username);
    if (fnd) {
      setMsg("user already exists");
      return;
    }
    const newdat = { username, password };
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newdat),
    })
      .then((res) => res.json())
      .then((dat) => {
        setData((prev) => [...prev, dat]);
        setPage("login");
        setUsername("");
        setPassword("");
        setMsg("reg success");
      });
  };

  const logF = () => {
    if (!username || !password) return;
    const fnd = data.find(
      (t) => t.username === username && t.password === password
    );
    if (fnd) {
      Cookies.set("loggedIn", "true", { expires: 1 }); // cookie expires in 1 day
      setMsg("log success");
      setUsername("");
      setPassword("");
      onLogging();
    } else {
      setMsg("authentication failed");
    }
  };

  const wanReg = () => {
    setPage("register");
  };

  return (
    <div>
      {page === "login" ? <p>Login</p> : <p>Register</p>}
      <label>Username</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {page === "login" ? (
        <button onClick={logF}>Login</button>
      ) : (
        <button onClick={regF}>Register</button>
      )}
      <button onClick={wanReg}>wanna register</button>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default Reglog;

//Cofvendmac.js
import React,{useState,useEffect} from "react"

const Cofvendmac=({onLogout})=>{
const [cofdat,setcofData]=useState([])
const [sizedat,setSizedat]=useState([])
const [addondat,setAddondat]=useState([])
const [qnty,setQnty]=useState(1)
const [cm,setC]=useState("")
const [sm,setS]=useState("")
const [am,setA]=useState([])
const [brew,setBrew]=useState(false)
const [ready,setReady]=useState(false)
const [total,setTotal]=useState({subtotal:0,tax:0,total:0})
const taxx=0.10
useEffect(()=>{
  fetch("http://localhost:5000/data")
  .then(res=>res.json())
  .then(dat=>{
    setcofData(dat.cofeeOptions)
    setSizedat(dat.sizes)
    setAddondat(dat.addOns)
  })
},[])
const cc=(e)=>{
  const aaa=e.target.value
  setC(aaa)
  calculation(aaa,sm,qnty,am)
}
const sc=(e)=>{
const bbb=e.target.value
setS(bbb)
calculation(cm,bbb,qnty,am)
}
const qc=(e)=>{
const qqq=parseInt(e.target.value)
setQnty(qqq)
calculation(cm, sm,qqq, am)
}
const ac=(e)=>{
  const {value,checked}=e.target
  let add;
  if (checked) {
    add=[...am,value]
    setA(add)
    calculation(add,cm,sm,qnty)
  }
  else {
    add=am.filter(t=>t !== value)
    setA(add)
    calculation(cm,sm,qnty,add)
  }
 
}

const calculation=((cm,sm,qnty,am)=>{
  const cof=cofdat.find(s=>s.name===cm)
  const siz=sizedat.find(s=>s.name===sm)
  if (!cof || !siz) return
  const bp=cof.price * siz.multiplier
  const adsum=am.reduce((sum,am)=>{
    const f=addondat.find(t=>t.name===am)
    return sum + (f? f.price :0)
  },0)
const st=qnty*(bp+adsum)
const tx=st*taxx
const tot=st+tx
setTotal({
  subtotal:st.toFixed(2),
  tax:tx.toFixed(2),
  total:tot.toFixed(2),
})
}
)
const bb=()=>{
  if (!cm || !sm) {
    alert("pls select")
    return 
  }
  setBrew(true)
  setReady(false)
  setTimeout(()=>{
    setBrew(false);
    setReady(true)
  },3000)}

const cb=()=>{
setBrew(false)
setReady(false)
  setC("")
  setA([])
  setS("")
  setQnty(1)
  setTotal({subtotal:0,tax:0,total:0})
}
return(
  <div>
    <h2>coffee vending machine</h2>
   
<button onClick={onLogout}>Logout</button>  
    <p>select coffee</p>
    <select onChange={cc} value={cm}>
      <option>none</option>
    {cofdat.map(t=>(
      <option value={t.name} key={t.id}>{t.name} {t.price}</option>
    ))}
    </select>
<div>
  <p>sizes</p>
{sizedat.map((t)=>(
  <label key={t.id}>
    <input
    type="radio"
    value={t.name}
    checked={sm===t.name}
  onChange={sc}
    />
    {t.name}
  </label>
))}
</div>
<p>Quantity</p>
<input
type="number"
value={qnty}
min="1"
onChange={qc}

/>
<p>addons</p>
{addondat.map((t)=>(
  <label key={t.id}>
    <input
    type="checkbox"
    value={t.name}
    onChange={ac}
    checked={am.includes(t.name)}
    />
    {t.name} {t.price}
  </label>
))}
<p>total </p>
<p>sub total {total.subtotal}</p>
<p>tax{total.tax}</p>
<p>total {total.total}</p>
<button onClick={bb}>brew</button>
<button onClick={cb}>clear</button>
{brew && <p>brewing</p>}
{ready && <p>take ur</p>}
  </div>
)

}
export default Cofvendmac
//App.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Reglog from "./components/Reglog";
import Cofvendmac from "./components/Cofvendmac";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const cookie = Cookies.get("loggedIn");
    if (cookie === "true") {
      setIsLoggedIn(true);
    }
  }, []);//so whenevr u do refresh page freshly loads and this triggers

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    Cookies.remove("loggedIn"); // clear cookie on logout
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <Cofvendmac onLogout={handleLogout} />
      ) : (
        <Reglog onLogging={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;


 
 //backend structure
 models
   reglogdat.js
 cofvenddata.js
 .env
 server.js

//models/reglogdat
 const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);
 //cofvenddata
 const cofeeOptions=[
    {id:1, name:"tea", price:6},
    {id:2, name:"blackTea", price:10},
    {id:3, name:"coffee", price:8},
    {id:4, name:"milk", price:5},
];
const sizes=[
    {id:1,name:"small",multiplier:1},
    {id:2,name:"Medium",multiplier:2},
    {id:3,name:"Large",multiplier:3},
];
const addOns=[
    {id:1,name:"withsugar",price:2},
    {id:2,name:"withhoney",price:5},
    {id:3,name:"withice",price:1},
    {id:4,name:"withchocolate",price:8}
];
module.exports={cofeeOptions,sizes,addOns}
 //.env
 PORT=5000
MONGO_URI=mongodb+srv://project1:<password>@cluster0.6ipy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
//server.js
 require("dotenv").config()
const express=require("express")
const cors=require("cors")
const app=express()
const mongoose=require("mongoose")
app.use(express.json())
app.use(cors())
const User=require("./models/reglogdat")
const {cofeeOptions,sizes,addOns}=require("./cofvenddata")
const port=process.env.PORT || 5000

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.error("server issue: ",err))

app.get("/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from MongoDB
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Optional: check if user already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get("/", (req,res)=>{
  res.json("server running")
})
app.get("/data", (req,res)=>{
  res.json({cofeeOptions,sizes,addOns})
})

app.listen(port,()=>{
  console.log(`server running on http://localhost:${port}`)
})


