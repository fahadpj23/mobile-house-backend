const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/placeorder",function(req,res)
 {
    // console.log(req.query.searchitem)
    
    searchqr=`SELECT * FROM ${req.query.type}  where id='${req.query.product}'`
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      res.send(result)
  }) 
  
})
module.exports=router;