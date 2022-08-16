const express=require('express')

const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/MyOrderDetails",function(req,res)
{
   getMyorder=`SELECT customerorderdetails.orderId,customername,phone,pincode,address,date,customerorderdetails.productid,productimage.image,products.name FROM customerorder LEFT JOIN customerorderdetails ON customerorder.orderid = customerorderdetails.orderId LEFT JOIN productimage ON productimage.productId=customerorderdetails.productid LEFT JOIN products ON products.id=customerorderdetails.productid`
   con.query(getMyorder,(err,result)=>{
    if(err) throw (err)
    else
    {
        res.json({"MyOrder":result})
    }
   })

})



module.exports=router;