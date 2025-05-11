frndend
------------
components //folder
  about.js
  Home.js
  "
  "
  "
  "
styles //folder
  Home.css
  "
  "
  "
App.js

-------------------
  //about.js
  import React from 'react';
function About() {
  return <h1>Details Page</h1>;
}

export default About;
//Cart.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
const Cart=() =>{
  const navigate = useNavigate();
  return (
  <div>
    <h1>Cart page Page</h1>
    <button onClick={() => navigate('/')}>Home</button>
    </div>
  )
}

export default Cart;
//Cofvendmac.js
import React,{useState,useEffect} from "react"
import { useNavigate } from 'react-router-dom';
const Cofvendmac=()=>{
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
const navigate = useNavigate();
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
    <button onClick={() => navigate('/')}>Home</button>

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
//details
 import React from 'react';
function Details() {
  return <h1>Details Page</h1>;
}

export default Details;

//Home
 import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Home Page</h1>
      <button onClick={() => navigate('/details')}>Go to Details</button>
      <button onClick={() => navigate('/about')}>Go to About</button>
      <button onClick={() => navigate('/cofvendmac')}>Go to Data</button>
      <button onClick={() => navigate('/cart')}>Go to Geera</button>
    </div>
  );
}

export default Home;
//Navbar
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onLogout }) {
  return (
    <nav>
      <Link to="/cart">Cart</Link> | 
      <Link to="/details">Details</Link> | 
      <Link to="/about">About</Link> | 
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
//Reglog
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

//App.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  BrowserRouter as Router,
} from "react-router-dom";

import Reglog from "./components/Reglog";
import Cofvendmac from "./components/Cofvendmac";
import Navbar from "./components/Navbar";
import Details from "./components/details";
import About from "./components/about";
import Cart from "./components/Cart";
import Home from "./components/Home";

const WrappedApp  = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cookie = Cookies.get("loggedIn");
    if (cookie === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate("/");
  };

  const handleLogout = () => {
    Cookies.remove("loggedIn");
    setIsLoggedIn(false);
    navigate("/Reglog");
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <Routes>
        {!isLoggedIn ? (
          <Route path="*" element={<Reglog onLogging={handleLoginSuccess} />} />
        ) : (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/details" element={<Details />} />
            <Route path="/about" element={<About />} />
            <Route path="/cofvendmac" element={<Cofvendmac />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </>
  );
};

// Wrap App in Router **only during export**
const App = () => (
  <Router>
    <WrappedApp />
  </Router>
);

export default App;









