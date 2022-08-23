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
    getcart=`select products.id,products.name,products.sellingPrice,products.salesPrice,products.mrp,products.warranty,products.qty as maxqty,products.Brand,products.HSN_code,products.Tax,products.category,products.Description,(select image from productimage where productimage.productId=products.id LIMIT 1) as image,products.variantid,cart.qty from products LEFT JOIN cart ON products.id=cart.productId where userId='${req.user.id}'`
    console.log(getcart)
    con.query(getcart,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({cart:result})
        }
    })
})



module.exports=router