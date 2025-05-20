//App.js
import React,{useState,useEffect} from "react"
const App=()=>{
  const  [data,setData]=useState([])
const [todo,setTodo]=useState("")
const [editid,setEditid]=useState(null)
const [r,setR]=useState([])

useEffect(()=>{
  fetch("http://localhost:5000/users")
  .then(res=>res.json())
  .then(dat=>{
    setData(dat)
  })
},[])
const addF=()=>{
  if (!todo) return 
  const newdat={
    text:todo,
    completed:false
  }
  fetch("http://localhost:5000/users",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify(newdat)
  }).then(res=>res.json())
  .then(dat=>{
    setData(prev=>[...prev,dat])
    setTodo("")
    setR([])
  })
}
const editF=(id)=>{
  if (!todo) return 
  fetch(`http://localhost:5000/users/${id}`,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({text:todo})
  }).then(res=>res.json())
  .then(dat=>{
    setData(prev=>prev.map(t=>t.id===id ? {...t,text:dat.text} : t))
setTodo('')
setEditid(null)

  })

}
const tooggle=(id)=>{
  const chk=data.find(t=>t.id===id)
  fetch(`http://localhost:5000/users/${id}`,{
    method:"PUT",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({completed:!chk.completed})
  }).then(res=>res.json())
  .then(dat=>{
    setData(prev=>prev.map(t=>t.id===id ? {...t,completed:dat.completed} : t))

})
}
const editidd=(id)=>{
  const fnd=data.find(t=>t.id===id)
setEditid(fnd.id)
setTodo(fnd.text)
}
const dlt=(id)=>{
  fetch(`http://localhost:5000/users/${id}`,{
    method:"DELETE"
  }).then(()=>{
    setData(prev=>prev.filter(t=>t.id !==id))
setR([])
  })

}
const searchF=()=>{
  if (!todo) return 
  const reslt=data.filter(t=>t.text.toLowerCase().includes(todo.toLocaleLowerCase()))
  setR(reslt)
 
}
return (
<div>
  <input
  type="text"
  onChange={(e)=>setTodo(e.target.value)}
value={todo}
  />
  {editid ? (<button onClick={()=>editF(editid)}>edit</button>) :(<button onClick={addF}>Add</button>)}
  <button onClick={searchF}>search</button>
  {r.length ? 
  (<ul>
   { r.map((t)=>(
      <li style={{textDecoration:t.completed ? "line-through" : "none"}}onClick={()=>tooggle(t.id)} key={t.id}>{t.text}
      <button onClick={()=>editidd(t.id)}>Edit</button>
      <button onClick={()=>dlt(t.id)}>Delete</button>
      </li>
    ))}
  </ul>) : (<ul>
   { data.map((t)=>(
      <li style={{textDecoration:t.completed ? "line-through" : "none"}}onClick={()=>{tooggle(t.id)}} key={t.id}>{t.text}
      <button onClick={()=>editidd(t.id)}>Edit</button>
      <button onClick={()=>dlt(t.id)}>Delete</button>
      </li>
    ))}
  </ul>)
}
</div>
)

}
export default App
//backend
├── node_modules/           # Installed dependencies (auto-created)
├── .gitignore              # Git ignore file
├── package.json            # Project metadata and dependencies
├── server.js               # Main Express server
├── mockData.js            # Mock user data

//mockData.js
module.exports = [];
//server.js
const express=require("express")
const cors=require("cors")
const port=5000
const app=express()
app.use(cors())
app.use(express.json())
let users=require("./mockData") // i used let because in delete operation im reassigning the value 
                                //users=users.filter(t=>t.id !== parseInt(id))
app.get("/", (req,res)=>{
  res.json("server running")
})
app.get("/users", (req,res)=>{
  res.json(users)
})
app.post("/users",(req,res)=>{
    const dat=req.body
   const newId=users.length ? users[users.length-1].id+1 :1
   const data={...dat,id:newId}
   users.push(data)
   res.status(201).json(data)
})
app.put("/users/:id",(req,res)=>{
const {id}=req.params
const chng=req.body
const index=users.findIndex(t=>t.id===parseInt(id))
if (index !== -1) {
    users[index]={...users[index],...chng}
    res.json(users[index])
}
else {
    res.status(401).json({error:"user not found"})
}
})
app.delete("/users/:id",(req,res)=>{
    const {id}=req.params
   users=users.filter(t=>t.id !== parseInt(id)) //let users value reassigned here
    res.send(`user ${id} deleted`)
})
app.listen(port,()=>{
  console.log(`Server running on http://localhost:${port}`)
})
