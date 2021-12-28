const express=require('express')
const router = express.Router()
const con=require('../database')
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: false });  
router.get("/login",function(req,res)
{
    console.log(req.query.username)
  
    loginqr=`SELECT COUNT(*) as count FROM users where username="${req.query.username}" AND password="${req.query.password}"`
    con.query(loginqr,(err,result,fields)=>{
            if(err)throw (err);
            res.send(result)
         })

})
router.post("/UserRegister",parseUrlencoded,function(req,res)
{
    // console.log(req.query.username)
  
    // loginqr=`SELECT COUNT(*) as count FROM users where username="${req.query.username}" AND password="${req.query.password}"`
    // con.query(loginqr,(err,result,fields)=>{
    //         if(err)throw (err);
    //         res.send(result)
    //      })
    console.log(req.body)
    console.log(req.query)

})

module.exports=router