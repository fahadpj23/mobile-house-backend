const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/getcover",function(req,res)
{
 con.query("SELECT * FROM products WHERE category='46' ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.send(result)
     }
 }) 
 
})
router.get("/getheadset",function(req,res)
{
 con.query("SELECT * FROM products WHERE category='47' ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.send(result)
     }
 }) 
 
})
router.get("/getaccessories",function(req,res)
{
 con.query("SELECT * FROM products WHERE category='48' ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.send(result)
     }
 }) 
})


router.get("/getphone",function(req,res)
{
 con.query("SELECT * FROM products WHERE category='49' ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.send(result)
     }
 }) 
})



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