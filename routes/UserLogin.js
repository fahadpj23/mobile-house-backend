const express=require('express')
const router = express.Router()
const con=require('../database')
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {sign}=require('jsonwebtoken')
const {check,validationResult}=require('express-validator')
router.get("/login",function(req,res)
{
    console.log(req.query.username)
  
    loginqr=`SELECT COUNT(*) as count FROM users where username="${req.query.username}" AND password="${req.query.password}"`
    con.query(loginqr,(err,result,fields)=>{
            if(err)throw (err);
            res.send(result)
         })

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
            res.json({UserToken: UserToken})
         })
    }
   }
    user=req.body
    
    console.log("fdf")
    console.log(req.body)
 

})

module.exports=router