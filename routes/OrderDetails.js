const express=require('express')
const router = express.Router()
const con=require('../database')
const validateUserToken = require('../middlewares/WebsiteMiddleware');


router.get('/SingleOrderDetails',validateUserToken,(req,res)=>{
    console.log(req.query)
    getMyorderdetails= `SELECT customerOrder.orderid,customerOrder.status,Total,customername,phone,pincode,address,date,customerorderdetails.productid,products.name,(SELECT image from productimage where productimage.productId=customerorderdetails.productid LIMIT 1 )as image FROM customerOrder LEFT JOIN customerorderdetails ON customerOrder.orderid = customerorderdetails.orderId LEFT JOIN products ON products.id=customerorderdetails.productid where  customerOrder.orderid='${req.query.orderId}' and  customerId='${req.user.id}'`

 
   con.query(getMyorderdetails,(err,result)=>{
    if(err) throw (err)
    else
    {
        res.json({"OrderDetail":result[0]})
       
    }
   })
})

module.exports=router