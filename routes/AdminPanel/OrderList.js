const express=require('express')
const router = express.Router()
const con=require('../../database')
const validateToken=require("../../middlewares/authmiddelware")

router.get("/customerorderdetails",(req,res)=>
    {
       
        searchqr=`SELECT * FROM customerOrder`
            con.query(searchqr,(err,result,fields)=>
            {
            
            if(err) throw(err);
            res.send(result)
       
             })

    })
   
  

module.exports=router;
