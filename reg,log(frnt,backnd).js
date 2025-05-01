//App.js
import React,{useState,useEffect} from "react"
const App=()=>{
const [page,setPage]=useState("Login")
const [username,setUsername]=useState("")
const [password,setPassword]=useState("")
const [msg,setMsg]=useState("")
const [data,setData]=useState([])
useEffect(()=>{
  fetch("http://localhost:5000/data")
    .then(res=>res.json())
    .then(dat=>setData(dat))
},[])
const handleReg=()=>{
  if (!username || !password) {
    setMsg("pls fill details")
    return 
  }
  const findd=data.find((a)=>a.username===username )
   if (findd) {setMsg("user Already Exists"); return } //u using return here bcs u not using "else" statement
  fetch("http://localhost:5000/data",{
    method: "POST",
    headers:{
"Content-Type":"application/json"
    },
    body:JSON.stringify({username,password})
  })

  .then(()=>{
    setPage("Login")
  setMsg("reg success")
  setUsername("")
  setPassword("")
  
  })
  .then(res=>res.json())
  .then(dat=>setData(dat))
}
const handleLog=()=>{
  if (!username || !password) {
    setMsg("pls fill details")
    return
  }
  const check=data.find((k)=>k.username===username && k.password===password)
  if (check) {
setMsg("log usccess")

  } else {setMsg("invalid details")}
  setUsername("")
  setPassword("")
  setMsg("")
}

const handlesetpag=()=>{
  setPage("Register")
}
  return (
    <div>
      {page==="Login" ? <h2>Login</h2> : <h2>Register</h2>}
      <label>Username</label>
      <input
      type="text"
      value={username}
      onChange={(s)=>setUsername(s.target.value)}
      />
      <label>Password</label>
      <input
      type="password"
      value={password}
      onChange={(s)=>setPassword(s.target.value)}
      />
      {page==="Register" ? (<button onClick={handleReg}> Register</button>) : (<button onClick={handleLog}>Login</button>)}
      {msg && <p>{msg}</p>}
      <button onClick={handlesetpag}>wanna Register</button>
    </div>
  )
}
export default App

//backend
//mockData.js
  module.exports=[{username:"",password:""}]
//server.js

  const express=require("express")
const cors=require("cors")
const port=5000
const app=express()
app.use(cors())
app.use(express.json())
let data=require("./mockData")

app.get("/", (req,res)=>{
  res.json("server running")
})
app.get("/data", (req,res)=>{
  res.json(data)
})
app.post("/data",(req,res)=>{
  const newDat=req.body
  data.push(newDat)
  res.status(201).json(newDat)
})
app.listen(port,()=>{
  console.log(`Server running on http://localhost:${port}`)
})
