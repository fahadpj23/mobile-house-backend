const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../database')
router.post("/orders",jsonParser,function(req,res)
    {
        let product=req.body;
        console.log(product)
        if(product.phone=="")
        {
           res.send("phone number is null")
        }
        else
        {
        addqr=`insert into productorder ( productid, productname,date, qty, price, total, customername, phone, pincode, address ) values ('${product.productid}','${product.productname}','${product.date}','${product.qty}','${product.price}','${product.total}','${product.customername}','${product.phone}','${product.pincode}','${product.address}')`;
            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else res.send("successfully added")
          })
        }
       
    }
    )
module.exports=router;