backend
  models
    -User.js
    -Item.js
  routes
    -userRoutes.js
    -itemRoutes.js
  server.js

//itemRoutes
const express=require("express")
const router=express.Router()
const Item=require("../models/items")


router.get("/", async (req,res)=>{
  try{
    const data=await Item.find()
    res.json(data)
  } catch(err)
  {
    res.status(501).json({error:"failed to fetch"})
  }
})
router.post("/", async (req,res)=>{
  try{
    const newdat= new Item(req.body)
    await newdat.save()
    res.status(201).json(newdat)

  }catch(err){
res.status(501).json({error:"failed to fetch"})
  }
})
router.put("/:id", async (req,res)=>{
 try{
  const updatedItem=await findByIdAndUpdate(req.params.id,req.body,{new:true})
  res.json(updatedItem)
 } catch(err){
  res.status(501).json({error:"failed to update"})
 }
})
router.delete("/:id", async (req,res)=>{
  try{
   const deletedItem=await findByIdAndDelete(req.params.id)
   res.json(updatedItem)
  } catch(err){
   res.status(501).json({error:"failed to update"})
  }
 })
 module.exports=router
//userRoutes

const express = require("express");
const bcrypt = require("bcrypt"); 
const User = require("../models/reglogdat");
const router=express.Router()

router.get("/", async (req,res)=>{
  try{
    const dat= await User.find()
  res.json(dat)
  }
  catch(err){
    res.status(501).json({error:"failed to fetch"})
  }
})
router.post("/",async(req,res)=>{
  const {username,password}=req.body
  try{
    const fnd=await User.findOne({username})
    if (fnd){
      return res.status(400).json({error:"user already exists"})
    }
    const hashedpass=await bcrypt.hash(password,10)
    const newuser=new User({username,password:hashedpass})
    await newuser.save()
    res.status(201).json({message:"user craeted"})
    
  }
  catch(err){
    res.status(501).json({error:"failed to save"})
  }
})
router.post("/loginn",async(req,res)=>{
  const {username,password}=req.body
  try{
    const findd=await User.findOne({username})
    if (!findd){
      return res.status(501).json({error:"no user found"})
    }
    const check= await bcrypt.compare(password,findd.password)
    if (!check) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const {password: _,...userData}=findd.toObject()
    
    res.json({ message: "Login success", user: userData });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  
  }
})
router.get("/loginn", (req, res) => {
  res.send("POST to /users/loginn with credentials to log in.");
});

module.exports=router
//server.js
require("dotenv").config()
const express=require("express")
const cors=require("cors")
const app=express()
const mongoose=require("mongoose")
app.use(express.json())
app.use(cors())
const User=require("./models/reglogdat")
const Item=require("./models/items")
const port=process.env.PORT || 5000
const userRoutes=require("./routes/userRoutes")
const itemRoutes=require("./routes/itemRoutes")
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected"))
.catch(err=>console.error("server issue: ",err))

app.use("/users",userRoutes)
app.use("/items",itemRoutes)

app.listen(port,()=>{
  console.log(`server running on http://localhost:${port}`)
})
