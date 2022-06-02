const express=require('express')
const router = express.Router()
const con=require('../database')


router.get('/HomePageCategory',function(req,res){
 
    getatt='select * from category where status=1'
    con.query(getatt,(err,result)=>{
      if(err) throw (err)
      else
      { 
           res.json({category:result})
      }
    })
})
router.get("/MobileHouseRecommend",function(req,res)
{
 con.query("SELECT *,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productimage.productId = products.id) as image from products ORDER BY id DESC ",(err,result,fields)=>{
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