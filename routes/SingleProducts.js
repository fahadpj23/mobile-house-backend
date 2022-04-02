const express=require('express')
const { object } = require('react-globally')
const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/singleview",function(req,res)
{
  
    singleqr=`SELECT * FROM products where id="${req.query.productId}"`

    con.query(singleqr,(err,result,fields)=>{
    if(err)throw (err);
    else
    {
        
        singleproductattribute=`SELECT * FROM productattribute where id="${req.query.productId}" `  
        con.query(singleproductattribute,(err1,result1)=>{
           if(err) throw (err)
           else
           {
               Object.entries(result1[0]).map((item,key)=>{
                   if(item[0]!="id" && item[1]!=null)
                   {
                       result[0][item[0]]=item[1]
                       
                   }
                   
               })
              res.send(result[0])
             
               
           }
        })
       
    }
    
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
    console.log(req.query)
 related=`SELECT * FROM products where name="${req.query.name}" and category="${req.query.category}"`  
 console.log(related)
 con.query(related,(err,result,fields)=>{
    if(err) throw(err);
    res.send(result)
})

})
module.exports=router;