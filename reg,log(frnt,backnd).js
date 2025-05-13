//App.js
//App.js
import React,{useState,useEffect} from "react"
const App=()=>{
const [data,setData]=useState([])
const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [msg,setMsg]=useState("")
const [page,setPage]=useState("login")
useEffect(()=>{
  fetch("http://localhost:5000/users")
  .then(res=>res.json())
  .then(dat=>setData(dat))
},[])

const regF=()=>{
  if (!username || !password) return setMsg("fill fields")
  if (username.length<5) return setMsg("username must be above 5 characters")
    if (password.length<5) return setMsg("password must be above 5 characters")
      const spsls=['!', '@', '#', '$', '%', '^', '&', '*'];
    const check=spsls.some(t=>password.includes(t))
    if (!check) return setMsg("password must contain one special character")
  const fnd=data.find(t=>t.username===username)
  if (fnd){
    setMsg("user already exists")
    return
  }
  const newdat={username:username,password:password}
  fetch("http://localhost:5000/users",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify(newdat)
  }).then(res=>res.json())
  .then(dat=>{
    setData(prev=>[...prev,dat])
    setPage("login")
    setUsername("")
    setPassword("")
    setMsg("reg success")
  })
  }

const logF=()=>{
  if (!username || !password) return
  const fnd=data.find(t=>t.username===username && t.password===password)
  if (fnd) {
    setMsg("log success")
    setUsername("")
    setPassword("")
  }
  else {
    setMsg("autenication filed")
  }
}
const wanReg=()=>{
  setPage("register")
}
return (
  <div>
    {page==="login" ? <p>Login</p> : <p>Register</p>}
    <label>Username</label>
    <input
    type="text"
    value={username}
    onChange={e=>setUsername(e.target.value)}
    />
    <label>password</label>
    <input
    type="password"
    value={password}
    onChange={e=>setPassword(e.target.value)}
    />
    {page==="login" ? <button onClick={logF}>Login</button> : <button onClick={regF}>Register</button>}
    <button onClick={wanReg}>wanna register </button>
    {msg && <p>{msg}</p>}
  </div>
)
}
export default App


//backend
//mockData.js
  module.exports=[]
//server.js
const express=require("express")
const cors=require("cors")
const app=express()
const port=5000
app.use(express.json())
app.use(cors())
const users=require("./mockData")

app.get("/users",(req,res)=>{
  res.json(users)
})
app.post("/users",(req,res)=>{
  const dat=req.body
  users.push(dat)
  res.status(201).json(dat)
})
app.listen(port,()=>{
  console.log(`server running on http://localhost:${port}`)
})
