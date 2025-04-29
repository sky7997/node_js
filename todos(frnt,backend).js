//App.js
import React, { useState,useEffect } from "react";

const App = () => {
  const [todo, setTodo] = useState("");
  const [data, setData] = useState([]);
  const [edited, setEdited] = useState(null);
  const [results, setResults] = useState([]);
const link="http://localhost:5000/data"

useEffect(()=>{
 fetch(link)
 .then(res=>res.json())
 .then(dat=>setData(dat))
},[])

  const editF = (id) => {
    if (!todo) return;
    

    fetch(`${link}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({text:todo})
    })
    .then(res=>res.json())
    .then(sd=>{
     
      setData(prev=>prev.map(t=>t.id===id ? {...t,text:sd.text} : t)); // u already updated data in backend but due to memory stored in frontend 
       // u have to do again in frontend
      setEdited(null);
      setTodo("");
      setResults([]);
    });
    }
   

  const addF = () => {
    if (!todo) return;
    const newDat = {
     
      text: todo,
      completed: false,
    };
   
    
    fetch("http://localhost:5000/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newDat),
    })
    .then(res=>res.json())
    .then(dat=>{
      setData(prev=>[...prev,dat]) // updating in frontend "state" even u updated in backend 
      setResults([]);
    setTodo("");
    })
  };

  const editC = (id) => {
    const idd = data.find((e) => e.id === id);
    setEdited(id);
    setTodo(idd.text);
  };

  const deleteF = (id) => {
  
    
    
    fetch(`${link}/${id}`, {
      method: "DELETE",
    })
    .then(()=>{  // in backend delete operation u r not returning any thing so no res.json()
      setData(prev=>prev.filter(t=>t.id !== id));// u already updated data in backend but due to memory stored in frontend 
      // u have to do again in frontend
      setResults([])
  })
  };

  const toggleF = (id) => {
    const tf = data.find(t=>t.id===id)
    fetch(`${link}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({completed:!tf.completed})
    })
    .then(res=>res.json())
    .then(sd=>{
      setData(prev=>prev.map(t=>t.id===id ? {...t,completed:sd.completed} : t));
      setResults([]);
    });
  };

  const searchF = () => {
    if (!todo) return;
    const r = data.filter((t) =>
      t.text.toLowerCase().includes(todo.toLowerCase())
    );
    setResults(r);
    setTodo("");
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={todo}
          placeholder="Type"
          onChange={(v) => setTodo(v.target.value)}
        />
        {edited !== null ? (
          <button onClick={() => editF(edited)}>Edit</button>
        ) : (
          <button onClick={addF}>Add</button>
        )}
        <button onClick={searchF}>Search</button>
      </div>

      <div>
        {results.length > 0 ? (
          <ul>
            {results.map((dat) => (
              <li key={dat.id} onClick={() => toggleF(dat.id)}>
                {dat.text}{" "}
                <button onClick={() => editC(dat.id)}>Edit</button>{" "}
                <button onClick={(e) =>{e.stopPropagation(); deleteF(dat.id)}}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <>
           
            <ul>
              {data.map((dat) => (
                <li
                  key={dat.id}
                  style={{
                    textDecoration: dat.completed
                      ? "line-through"
                      : "none",
                  }}
                  onClick={() => toggleF(dat.id)}
                >
                  {dat.text}{" "}
                  <button onClick={() => editC(dat.id)}>Edit</button>{" "}
                  <button onClick={(e) =>{ e.stopPropagation();deleteF(dat.id)}}>Delete</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default App;

//server.js
const express=require("express")
const cors=require("cors")
const port=5000
const app=express()
app.use(cors())
app.use(express.json())
let mockData=require("./mockData")

app.get("/data", (req,res)=>{
  res.json(mockData)
})

app.post("/data", (req,res)=>{
  const dat=req.body
  const newId=mockData.length ? mockData[mockData.length-1].id+1 : 1
  const newDat={...dat, id:newId}
  mockData.push(newDat)
  res.status(201).json(newDat)
})

app.put("/data/:id", (req,res)=>{
  const {id}=req.params
  const datt=req.body
  const indx=mockData.findIndex(t=>t.id===parseInt(id))
  if (indx !== -1) {
    mockData[indx]={...mockData[indx],...datt}
    res.json(mockData[indx])
  }
  
  else {
    res.status(401).json({error:"user not found"})
  }
})
app.delete("/data/:id", (req,res)=>{
  const {id}=req.params
 mockData=mockData.filter(k=>k.id !== parseInt(id))
res.send(`user ${id} deleted`)
})
app.listen(port,()=>{
  console.log(`Server running on http://localhost:${port}`)
})
