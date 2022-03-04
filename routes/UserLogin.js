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

router.get("/login",function(req,res)
{
    console.log(req.query.username)
  
    loginqr=`SELECT * FROM users where username="${req.query.username}" `
    con.query(loginqr,(err,result,fields)=>{
            if(err)throw (err);
            if(result[0].password)
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
            else
            {
                res.json("invalid username")
            }
         })

})

router.get("/userAuthentication",validateToken,function(req,res)
{
    res.json({"success":"success"})
})


//register the user
router.post("/UserRegister",
[
check('username').notEmpty(),
check('MobileNumber').notEmpty(),
check('password').notEmpty(),
check('ConfirmPassword').notEmpty()
],
parseUrlencoded,function(req,res)
{
   const{username,MobileNumber,password,ConfirmPassword}=req.body
   const error=validationResult(req);
   if(!error.isEmpty()){
    return res.json({errors:error.array()})
   }
   else
   {
    
    serachuser=`SELECT COUNT(username) as count FROM users where username="${req.body.username}" `
    count=
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
            const UserToken=sign({usernamejwt},"importantsecret")
            bcrypt.hash(user.password,10).then((hash)=>{
                adduser=`insert into users (username,phone,password) values ('${user.username}','${user.MobileNumber}','${hash}')`
                con.query(adduser,(err,result,fields)=>{
                    if(err)throw (err);
                    res.json({UserToken: UserToken,username:user.username})
                })
            
            })
            }
            
        }   
    }
    })
       
   }
   
 

})

module.exports=router