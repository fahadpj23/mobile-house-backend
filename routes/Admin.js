const express=require('express')
const router = express.Router()
const con=require('../database')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const bcrypt=require('bcrypt')
const {sign}=require('jsonwebtoken')
router.get("/adminlogin",function(req,res)
 {
    searchqr=`SELECT * FROM admin  where username='${req.query.username}' `
    console.log(req.query.password)
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      if(result[0].password==undefined)
      {
        res.send("no user")
      }
      else
      {
      try{
        bcrypt.compare(result[0].password,req.query.password)
        const accessToken=sign({username:req.query.username},"importantsecret");
        res.json({"accessToken":accessToken})
      }
      catch{
        res.send("password is incorrect")
      }
    }
  }) 
  
}) 

module.exports=router;