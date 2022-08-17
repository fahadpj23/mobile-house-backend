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
                        const UserToken=sign({username:req.query.username,id:result[0].id},"importantsecret");
                      res.json({"UserToken":UserToken,"username":req.query.username})
                   
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

router.post('/CartAdd',validateUserToken,(req,res)=>{
        console.log(req.user)
        
         product=req.body
         console.log(product)
        addtocart=`insert into cart (userId,productId,qty) values('${req.user.id}','${product.productId}','${product.qty}')`
        con.query(addtocart,(err,result)=>{
            if(err) throw (err)
            else 
            res.json({success:"added to cart"})
        })
})

router.get('/getUserCart',validateUserToken,(req,res)=>{
    // getcart=`select id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid from products LEFT JOIN cart ON products.id=cart.productId where userId='${req.user.id}'`
    getcart=`select products.id,products.name,products.sellingPrice,products.salesPrice,products.mrp,products.warranty,products.qty as maxqty,products.Brand,products.HSN_code,products.Tax,products.category,products.Description,products.variantid from products LEFT JOIN cart ON products.id=cart.productId where userId='${req.user.id}'`
    con.query(getcart,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({cart:result})
        }
    })
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
                        const UserToken=sign({username:req.body.username,id:result[0].id},"importantsecret");
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