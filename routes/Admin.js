const express=require('express')
const router = express.Router()
const con=require('../database')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const bcrypt=require('bcrypt')
router.get("/adminlogin",function(req,res)
 {
    searchqr=`SELECT * FROM admin  where username='${req.query.username}' `
    console.log(req.query.password)
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      console.log(result[0].password)
      try{
        bcrypt.compare(result[0].password,req.query.password)
        res.send("success")
      }
      catch{
        res.send("password is incorrect")
      }
  }) 
  
})

module.exports=router;