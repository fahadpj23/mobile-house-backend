const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/placeorder",function(req,res)
 {
    // console.log(req.query.searchitem)
    
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
module.exports=router;