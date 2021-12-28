const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/singleview",function(req,res)
{
  
    singleqr=`SELECT * FROM ${req.query.type} where id="${req.query.product}"`
    // singleqr=`SELECT name,price,color,mrp,image FROM headset  where name='${req.query.product}' union aLL SELECT name,price,color,mrp,image FROM accessories  where name='${req.query.product}' union aLL SELECT name,price,color,mrp,image FROM cover where name='${req.query.product}'`

    con.query(singleqr,(err,result,fields)=>{
    if(err)throw (err);
    res.send(result)
})
})
router.get("/pincode",function(req,res)
{
 pinsearch=`select * from pincode where pincode='${req.query.pincodeno}'`
 con.query(pinsearch,(err,result)=>{
    if(err) throw (err);
    else res.send(result)
})
})
router.get("/related",function(req,res)
{

 related=`SELECT * FROM ${req.query.type} where brand="${req.query.brand}"`  
 con.query(related,(err,result,fields)=>{
    if(err) throw(err);
    res.send(result)
})
 
})
module.exports=router;