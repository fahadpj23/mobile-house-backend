const express=require('express')
const router = express.Router()
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: false });   
const con=require('../../database')
const validateToken=require("../../middlewares/authmiddelware")
router.get("/products",validateToken,function(req,res)
    {
       
        addqr=`SELECT id,name,price,color,mrp,warranty,brand,maxqty,type FROM cover union SELECT id,name,price,color,mrp,warranty,brand,maxqty,type FROM headset union SELECT id,name,price,color,mrp,warranty,brand,maxqty,type FROM accessories`;
        con.query(addqr,(err,result,fields)=>{

            if(err) throw(err);
            res.send(result)
            
        }) 
    }
    )


router.post("/productdelete",validateToken,function(req,res)
{
    
    query=`DELETE FROM ${req.body.database} Where id=${req.body.id}`
    con.query(query,(err,result,fields)=>{
        if(err) throw(err);
        res.send("deleted")
    })
    
    

})
router.get("/updateproductdetails",validateToken,function(req,res)
{
    
    query=`SELECT * FROM ${req.query.database} Where id=${req.query.id}`
    con.query(query,(err,result,fields)=>{
        if(err) throw(err);
        res.send(json({result}))
        
    })
    
    

})
router.post("/Editproduct",validateToken,parseUrlencoded,function(req,res)
{
    if(req.body.type=="cover")
    {
        query=`UPDATE cover SET id="${req.body.id}", productid="${req.body.productid}", name="${req.body.name}", color="${req.body.color}" , price="${req.body.price}",  mrp="${req.body.mrp}" , warranty= "${req.body.warranty}" ,image="${req.body.image}", brand="${req.body.brand}" ,type= "${req.body.type}", maxqty="${req.body.maxqty}" ,material="${req.body.material}" WHERE productid="${req.body.productid}" ` 
        con.query(query,(err,result,fields)=>{
            if(err) throw(err);
            
            else
            res.redirect('http://localhost:3000/ShopProduct');
        })
    }
    if(req.body.type=="headset")
    {
        query=`UPDATE headset SET id="${req.body.id}", productid="${req.body.productid}", name="${req.body.name}", color="${req.body.color}" , price="${req.body.price}",  mrp="${req.body.mrp}" , warranty= "${req.body.warranty}" ,image="${req.body.image}", brand="${req.body.brand}" ,type= "${req.body.type}", maxqty="${req.body.maxqty}" ,material="${req.body.material}" ,headsetType="${req.body.headsetType}" WHERE productid="${req.body.productid}" ` 
        con.query(query,(err,result,fields)=>{
            if(err) throw(err);
            else
             res.redirect('http://localhost:3000/ShopProduct');
            
        })
    }
    if(req.body.type=="accessories")
    {
        query=`UPDATE accessories SET id="${req.body.id}", productid="${req.body.productid}", name="${req.body.name}", color="${req.body.color}" , price="${req.body.price}",  mrp="${req.body.mrp}" , warranty= "${req.body.warranty}" ,image="${req.body.image}", brand="${req.body.brand}" ,type= "${req.body.type}", maxqty="${req.body.maxqty}" ,material="${req.body.material}" WHERE id="${req.body.productid}" ` 
        con.query(query,(err,result,fields)=>{
            if(err) throw(err);
            else
             res.redirect('http://localhost:3000/ShopProduct');
           
        })
    }
 
  

})

module.exports=router;


// router.get("/accessories",function(req,res)
// {
//  con.query("SELECT * FROM accessories",(err,result,fields)=>{
//      if(err) throw(err);
//      res.send(result)
//  }) 
 
// })