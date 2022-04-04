const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/searchProduct",function(req,res)
 {
    // console.log(req.query.searchitem)
    
    searchqr=`SELECT * from products where name LIKE N'%${req.query.searchitem}%'`
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      res.send(result)
  }) 
  
})
module.exports=router;