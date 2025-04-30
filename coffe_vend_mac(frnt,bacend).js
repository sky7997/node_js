//App.js
import React, {useState,useEffect} from "react"
const App=()=>{
  const [selectedCoffee, setSelectedCoffee] = useState("")
  const [size,setSize]=useState("")
  const [qnty,setQnty]=useState(1)
  const [addOn,setAddOn]=useState([])
  const [brew,setBrew]=useState(false)
  const [ready,SetReady]=useState(false)
  const [total,setTotal]=useState({subtotal:0, tax:0, total:0})
const tax=0.10
const [cofdat,setCofdat]=useState([])
const [sizeDat,setSizedat]=useState([])
const [addDat,setAddOndat]=useState([])


  useEffect(()=>{
    fetch("http://localhost:5000/data")
    .then(res=>res.json())
    .then(dat=>{
      setCofdat(dat.coffeeOptions)
      setSizedat(dat.sizes)
      setAddOndat(dat.addOns)
 
    })
  },[])

const cofeChange=(e)=>{
const cc=e.target.value
setSelectedCoffee(cc)
calculate(cc,size,qnty,addOn)
}
const sizechnge=(e)=>{
  const sc=e.target.value
  setSize(sc)
  calculate(sc,selectedCoffee,addOn,qnty)
}
const onChnageqty=(e)=>{
  const cq=parseInt(e.target.value)
  setQnty(cq)
  calculate(cq,selectedCoffee,addOn,size)
}
const addChange=(e)=>{
  
    const { value, checked } = e.target;
    let newdat;
    if (checked) {
      newdat = [...addOn, value];
      setAddOn(newdat); // Update the addOn state
    } else {
      newdat = addOn.filter(j => j !== value);
      setAddOn(newdat); // Update the addOn state
    }
    calculate(selectedCoffee, size, qnty, newdat); // Use the updated newdat here
  };
  


const brewCLick=()=>{
if (!selectedCoffee || !size) {
  alert("pls select")
  return
}
setBrew(true)
SetReady(false)
setTimeout(()=>{
  setBrew(false)
  SetReady(true)
},3000)
}
const clearCLick=()=>{
  setSelectedCoffee("")
  setSize("")
  setQnty(1)
  setAddOn([])
  setBrew(false)
  SetReady(false)
  setTotal({subtotal:0, tax:0, total:0})
}
const calculate=(selectedCoffee,size,qnty,addOn)=>{
  const s=cofdat.find(c=>c.name===selectedCoffee)
  const sz=sizeDat.find(s=>s.name===size)
  if (!s || !sz) return
  const basePrice=s.basePrice*sz.multiplier
  const addprice=addOn.reduce((sum,addOn)=>{
    const f=addDat.find(j=>j.name===addOn)
    return sum + (f? f.price:0)
  },0)
  const st=qnty*(basePrice+addprice)
  const tx=st*tax
  const totl=st+tx

  setTotal({
    subtotal:st.toFixed(2),
    tax:tx.toFixed(2),
    total:totl.toFixed(2)
  })
}

  return (
    <div>
      <div>
        <h1>Coffee Vending MAchine</h1>
        <label>selected coffee</label>
        <select value={selectedCoffee} onChange={cofeChange}>
        {cofdat.map((t,index)=>(
          <option value={t.name} key={index}>{t.name} {t.basePrice}</option>
        ))}
        </select>
        <label>Select Size</label>
        {sizeDat.map((y,i)=>(
          <div>
          <label key={i}>
          <input
          type="radio"
          value={y.name}
          onChange={sizechnge}
          checked={size===y.name}
          />{y.name}</label>
          </div>
        ))}
        <label>Select Quantity</label>
        <input
        type="number"
        min="1"
        value={qnty}
        onChange={onChnageqty}
        />
        <label>Add ons</label>
        { addDat.map((k,l)=>(
          <label key={l}>
            <input
            type="checkbox"
            value={k.name}
            onChange={addChange}
            checked={addOn.includes(k.name)}
            />{k.name} (${k.price})
          </label>
        ))}
        <h1>Order Summary</h1>
        <p>subtotal : {total.subtotal}</p>
        <p>tax : {total.tax}</p>
        <p> total : {total.total}</p>
        <div>
          <button onClick={brewCLick}>Brew</button>
          <button onClick={clearCLick}>Clear</button>
          {brew && <p>Brewing your coffee please wait</p>}
          {ready && <h1>your cofee is ready</h1>}
        </div>
      </div>
    </div>
  )
}
export default App

//backend
//Mockdata.js
const coffeeOptions = [
  { name: "Espresso", basePrice: 2 },
  { name: "Cappuccino", basePrice: 3 },
  { name: "Latte", basePrice: 3.5 },
  { name: "Americano", basePrice: 2.5 },
];

const sizes = [
  { name: "Small", multiplier: 1 },
  { name: "Medium", multiplier: 1.5 },
  { name: "Large", multiplier: 2 },
];

const addOns = [
  { name: "Extra Shot", price: 0.7 },
  { name: "Milk", price: 0.4 },
  { name: "Sugar", price: 0.3 },
  { name: "Whipped Cream", price: 0.6 },
];

module.exports={coffeeOptions,sizes,addOns};

//server.js
const express=require("express")
const cors=require("cors")
const port=5000
const app=express()
app.use(cors())
app.use(express.json())
let {coffeeOptions,sizes,addOns}=require("./mockData")

app.get("/", (req,res)=>{
  res.json("server running")
})
app.get("/data", (req,res)=>{
  res.json({coffeeOptions,sizes,addOns})
})

app.listen(port,()=>{
  console.log(`Server running on http://localhost:${port}`)
})
