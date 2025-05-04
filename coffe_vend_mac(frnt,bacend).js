//App.js
//App.js
import React,{useState,useEffect} from "react"

const App=()=>{
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
export default App


//backend
//Mockdata.js
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

//server.js
const express=require("express")
const cors=require("cors")
const port=5000
const app=express()
app.use(cors())
app.use(express.json())
let {cofeeOptions,sizes,addOns}=require("./mockData")

app.get("/", (req,res)=>{
  res.json("server running")
})
app.get("/data", (req,res)=>{
  res.json({cofeeOptions,sizes,addOns})
})

app.listen(port,()=>{
  console.log(`Server running on http://localhost:${port}`)
})
