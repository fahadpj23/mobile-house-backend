const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');

router.get("/getAttribute",(req,res)=>
    {
       
        categorysearchqr=`SELECT * FROM attribute`
            con.query(categorysearchqr,(err,result,fields)=>
            {
            
            if(err) throw(err);
            res.send(result)
       
             })

    })
    router.post("/categoryAdd",parseUrlencoded,(req,res)=>
    {
       
        // categorysearchqr=`SELECT * FROM attribute`
        //     con.query(categorysearchqr,(err,result,fields)=>
        //     {
            
        //     if(err) throw(err);
        //     res.send(result)
       
        //      })
        console.log(req.body)

    })

    
   
  

module.exports=router;