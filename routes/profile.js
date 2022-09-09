const express=require('express')
const validateUserToken=require('../middlewares/WebsiteMiddleware')
const router = express.Router()
const con=require('../database')

var bodyParser=require("body-parser");

var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
//get the single product detail
router.get("/MyOrderDetails",validateUserToken,function(req,res)
{
   getMyorder= `SELECT customerOrder.orderid,customerOrder.status,Total,customername,phone,pincode,address,date,customerorderdetails.productid,products.name,(SELECT image from productimage where productimage.productId=customerorderdetails.productid LIMIT 1 )as image FROM customerOrder LEFT JOIN customerorderdetails ON customerOrder.orderid = customerorderdetails.orderId LEFT JOIN products ON products.id=customerorderdetails.productid where customerId='${req.user.id}'`

   console.log(getMyorder)
   con.query(getMyorder,(err,result)=>{
    if(err) throw (err)
    else
    {
        res.json({"MyOrder":result})
    }
   })

})

//personal address of customer
router.post("/AddpersonalDetails",validateUserToken,parseUrlencoded,function(req,res)
{
    deletePersonalDetails=`Delete from userPersonalDetails where UserId='${req.user.id}'`
   
    con.query(deletePersonalDetails,(err1,result1)=>{
        if(err1) throw (err1)
        else
        {
            AddPersonalDetails= `insert into userPersonalDetails(UserId, FirstName,LastName, Gender, Email,MobileNumber ) Values('${req.user.id}','${req.body.FirstName}','${req.body.lastName}','${req.body.Gender}','${req.body.email}','${req.body.mobileNumber}')`

           
            con.query(AddPersonalDetails,(err,result)=>{
             if(err) throw (err)
             else
             {
                 res.json({"success":"Personal Details Added"})
             }
            })
            
        }
    })
  
})

router.get('/PersonalDetails',validateUserToken,(req,res)=>{
    getPersonalDetails=`select * from userpersonaldetails where USerId='${req.user.id}'`
    con.query(getPersonalDetails,(err,result)=>{
        if(err) throw (err)
        else
        res.json({PersonalDetails:result[0] ??"No data"})
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