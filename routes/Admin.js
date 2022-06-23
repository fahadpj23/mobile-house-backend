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
   
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      if(result[0].password==undefined)
      {
        res.send("no user")
      }
      else
      {
      
        bcrypt.compare(req.query.password,result[0].password).then((match)=>{
        
          if(!match) res.json({error:"password is incorrect"})
          else
          {
            const accessToken=sign({username:req.query.username},"importantsecret");
            res.json({"accessToken":accessToken})
         
          }
        })
       
        
     
    }
  }) 
  
}) 

module.exports=router;