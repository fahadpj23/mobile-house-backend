const express=require('express')
const router = express.Router()
const con=require('../database')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const bcrypt=require('bcrypt')
const {sign}=require('jsonwebtoken')
var parseUrlencoded = bodyParser.urlencoded({ extended: true }); 
router.post("/adminlogin",parseUrlencoded,function(req,res)
 {
   
    searchqr=`SELECT * FROM admin  where username='${req.body.username}' `
    
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      if(result[0])
      {
       
     
      
        bcrypt.compare(req.body.password,result[0].password).then((match)=>{
        
          if(!match) res.json({error:"password is incorrect"})
          else
          {
            const accessToken=sign({username:req.body.username},"importantsecret");
            res.json({"accessToken":accessToken})
         
          }
        })
      }
      else
      {
        res.json({"error":"No User Found"})
      }
        
     
    
  }) 

//     const user=req.body
//   bcrypt.hash(user.password,10).then((hash)=>{
//     adduser=`insert into admin (username,password) values ('${user.username}','${hash}')`
//     con.query(adduser,(err,result,fields)=>{
//         if(err)throw (err);
//         res.json({username:user.username})
//     })

// })
}) 



module.exports=router;