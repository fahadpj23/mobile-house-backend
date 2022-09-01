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

router.post('/UserAddressAdd',validateUserToken,function(req,res)
{
    const userDetails=req.body
    addAddress=`insert into useraddress(UserId,Name,Phone,Pincode,Locality,Address,city,state,Landmark,alternativePhone) values ('${req.user.id}','${userDetails.name}','${userDetails.phone}','${userDetails.pincode}','${userDetails.locality}','${userDetails.address}','${userDetails.city}','${userDetails.state}','${userDetails.landmark}','${userDetails.alternativePhone}')` 
    con.query(addAddress,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({success:"Address Added successfully"})
        }
    })
})


router.get("/getUserAddress",validateUserToken,function(req,res)
{
    getAddress=`SELECT * from useraddress where UserId='${req.user.id}'`

   con.query(getAddress,(err,result)=>{
    if(err) throw (err)
    else
    {
        res.json({"Address":result})
    }
   })

})



module.exports=router;