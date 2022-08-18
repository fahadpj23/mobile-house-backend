const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  



router.get('/getOrder',validateToken,(req,res)=>{
   let Tablehead=[];
        customerorderget=`SELECT * FROM customerOrder  ORDER BY orderid DESC `
        con.query(customerorderget,(err,result)=>{
         if(err) throw(err)
         else
         {
           
            result[0] && Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
                if(Object.entries(result[0]).length==key+1)
                {
                    
                    res.json({ "Data":result,"TableHead":Tablehead })
                }
            })
         }
        })
  
})  


router.post('/DeliveryStatusUpdate',validateToken,(req,res)=>{
   
    UpdateDeliveryStatus=`UPDATE customerorder SET status=${req.body.status} where orderid=${req.body.orderid}` 
    console.log(UpdateDeliveryStatus)
    con.query(UpdateDeliveryStatus,(err,result)=>{
        if(err) throw (err)
        else
        {
            res.json({"success":"success"})
        }
    })
   
 }) 




module.exports=router;