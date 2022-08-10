const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/viewAll",function(req,res)
{

    if(req.query.product=="Mobile Covers")
    {   
        con.query("SELECT * FROM cover",(err,result,fields)=>{
            if(err) throw(err);
            res.send(result)

        }) 
    }
    
    if(req.query.product=="Mobile Accessories")
    {
        con.query("SELECT * FROM accessories",(err,result,fields)=>{
            if(err) throw(err);
            res.send(result)
          
        }) 
    }
    if(req.query.product=="Mobile Headset")
    {
        con.query("SELECT * FROM headset",(err,result,fields)=>{
            if(err) throw(err);
            res.send(result)
            
        }) 
    }

})

module.exports=router;