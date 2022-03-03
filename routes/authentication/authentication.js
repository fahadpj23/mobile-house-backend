const express=require('express')
const router = express.Router()
const con=require('../../database')
const validateToken=require("../../middlewares/authmiddelware")
 router.get("/authentication",validateToken,(req,res)=>{
    res.json({"success":"success"})
 })


 module.exports=router; 