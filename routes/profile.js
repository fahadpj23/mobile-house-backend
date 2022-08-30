const express=require('express')
const validateUserToken=require('../middlewares/WebsiteMiddleware')
const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/MyOrderDetails",validateUserToken,function(req,res)
{
   getMyorder=`SELECT customerorderdetails.orderId,customername,phone,pincode,address,date,customerorderdetails.productid,productimage.image,products.name FROM customerOrder LEFT JOIN customerorderdetails ON customerOrder.orderid = customerorderdetails.orderId LEFT JOIN productimage ON productimage.productId=customerorderdetails.productid LEFT JOIN products ON products.id=customerorderdetails.productid where customerId='${req.user.id}'`
   console.log(getMyorder)
   con.query(getMyorder,(err,result)=>{
    if(err) throw (err)
    else
    {
        res.json({"MyOrder":result})
    }
   })

})



module.exports=router;