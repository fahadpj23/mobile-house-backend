const express=require('express')
const router = express.Router()
const con=require('../database')
const { verify } = require("jsonwebtoken");
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {sign}=require('jsonwebtoken')
const {check,validationResult}=require('express-validator')
const validateToken=require("../middlewares/authmiddelware")
const bcrypt=require("bcrypt")
const validateUserToken=require("../middlewares/WebsiteMiddleware");
const { response } = require('express');
router.post("/login",function(req,res)
{
    
 
    loginqr=`SELECT * FROM users where username="${req.body.username}" `
    console.log(loginqr)
    con.query(loginqr,(err,result,fields)=>{
            if(err)throw (err);
            console.log(result)
            if(result.length!=0)
            {
                
                bcrypt.compare(req.body.password,result[0].password).then((match)=>{
        
                    if(!match) res.json({error:"password is incorrect"})
                    else
                    {
                        const UserToken=sign({username:req.body.username,id:result[0].id},"importantsecret");
                      res.json({"UserToken":UserToken,"username":req.body.username})
                   
                    }
                  })
                 
               
            }
            else
            {
                res.json({error:"invalid username"})
            }
         })

})

router.get("/userAuthentication",validateToken,function(req,res)
{
    res.json({"success":"success"})
})



//register the user
router.post("/UserRegister",parseUrlencoded,function(req,res)
{
 console.log(req.body)
  
      
    serachuser=`SELECT COUNT(username) as count FROM users where username="${req.body.username}" `
    con.query(serachuser,(err,result,fields)=>{
    if(err)throw (err);
    else 
    {
        if(result[0].count!=0)
        {
            res.json({"alreadyexist":" username already exist"})

        }
        else
        {
            const user=req.body
            const usernamejwt=req.body.username
            if(user.password!=user.ConfirmPassword)
            {
                res.json({error:"password is not match"})
            }
            else
            {

           
            bcrypt.hash(user.password,10).then((hash)=>{
                adduser=`insert into users (username,phone,password) values ('${user.username}','${user.MobileNumber}','${hash}')`
                con.query(adduser,(err,result,fields)=>{
                    if(err)throw (err);
                    else
                    {
                       
                        const UserToken=sign({username:req.body.username,id:result.insertId},"importantsecret");
                        res.json({UserToken: UserToken,username:user.username})
                    }
                })
            
            })
            }
            
        }   
    }
    })
       
   
   
 

})

module.exports=router