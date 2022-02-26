const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../database')
router.post("/orders",jsonParser,function(req,res)
    {
        let orderinfo=req.body;
        console.log(orderinfo)
        let products=JSON.parse(orderinfo.product)
       Object.values( products).map((item,key)=>{
          
      
        
        addqr=`insert into productorder ( productid, productname,date, qty, price, total, customername, phone, pincode, address ) values ('${item.productid}','${item.name}','dssd','${item.qty}','${item.price}','${item.price*item.qty}','${orderinfo.name}','${orderinfo.phone}','${orderinfo.pincode}','${orderinfo.address}')`;
            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else res.send("successfully added")
            
          })
          console.log(addqr)
        })
       
    }
    )
module.exports=router; 