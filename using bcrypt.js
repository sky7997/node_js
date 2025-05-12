const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


 module.exports = mongoose.model('User', userSchema);

------------------------------------------------------------------
//userRouter.js
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
