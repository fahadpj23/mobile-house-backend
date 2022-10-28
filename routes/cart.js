const express=require('express')
const router = express.Router()
const con=require('../database')

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
    
    con.query(getcart,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({cart:result})
        }
    })
})
router.post('/CartQtyUpdate',validateUserToken,(req,res)=>{

    product=req.body

    UpdateCartQty=`Update  cart set qty='${product.qty}' where productId='${product.productId}' and userId='${req.user.id}'`
    con.query(UpdateCartQty,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({success:"cart qty updated successfully"})
        }
    })
})



module.exports=router