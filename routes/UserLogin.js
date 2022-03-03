const express=require('express')
const router = express.Router()
const con=require('../database')
const { verify } = require("jsonwebtoken");
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {sign}=require('jsonwebtoken')
const {check,validationResult}=require('express-validator')
const validateToken=require("../middlewares/authmiddelware")

router.get("/login",function(req,res)
{
    console.log(req.query.username)
  
    loginqr=`SELECT * FROM users where username="${req.query.username}" `
    con.query(loginqr,(err,result,fields)=>{
            if(err)throw (err);
            if(result[0].password)
            {
                const UserToken=sign({username:req.query.username},"importantsecret");
             
                res.json({ UserToken: UserToken,username:req.query.username})
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
    const user=req.body
    const usernamejwt=req.body.username
    if(user.password!=user.ConfirmPassword)
    {
        res.json({error:"password is not match"})
    }
    else
    {
     const UserToken=sign({usernamejwt},"importantsecret")

    adduser=`insert into users (username,phone,password) values ('${user.username}','${user.MobileNumber}','${UserToken}')`
    con.query(adduser,(err,result,fields)=>{
            if(err)throw (err);
            res.json({UserToken: UserToken,username:user.username})
         })
    }
   }
    user=req.body
    
    console.log("fdf")
    console.log(req.body)
 

})

module.exports=router