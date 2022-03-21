const express=require('express')
const router = express.Router()
const con=require('../database')
// router.get("/accessories",function(req,res)
// {
//  con.query("SELECT * FROM accessories",(err,result,fields)=>{
//      if(err) throw(err);
//      res.send(result)
//  }) 
 
// })
// router.get("/headset",function(req,res)
// {
//  con.query("SELECT * FROM headset",(err,result,fields)=>{
//      if(err) throw(err);
     
//      res.send(result)
//  }) 
 
// })
// router.get("/cover",function(req,res)
// {
//  con.query("SELECT * FROM cover",(err,result,fields)=>{
//      if(err) throw(err);
//      res.send(result)
//  })   
// })
// router.get("/access",function(req,res)
// {
//  con.query("SELECT * FROM access",(err,result,fields)=>{
//      if(err) throw(err);
    
//      res.send(result)
//  })   
// })
module.exports=router;