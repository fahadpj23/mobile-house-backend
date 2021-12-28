const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/adminlogin",function(req,res)
 {
    searchqr=`SELECT * FROM admin  where username='${req.query.username}' AND password='${req.query.password}'`
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      res.send(result)
  }) 
  
})
module.exports=router;