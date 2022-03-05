const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")

router.get("/getCatgeory",(req,res)=>
    {
       
        categorysearchqr=`SELECT * FROM category`
            con.query(categorysearchqr,(err,result,fields)=>
            {
            
            if(err) throw(err);
            res.send(result)
       
             })

    })
   
  

module.exports=router;