const express=require('express')
const router = express.Router()
const con=require('../../database')
router.get("/orderdetails",function(req,res)
    {
        
        searchqr=`SELECT * FROM productorder`
            con.query(searchqr,(err,result,fields)=>
            {

            if(err) throw(err);
            res.send(result)
       
             })

    })
   
  

module.exports=router;
