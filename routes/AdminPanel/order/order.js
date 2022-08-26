const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  



router.get('/getOrder/getData',validateToken,(req,res)=>{
   let Tablehead=[];
        customerorderget=`SELECT * FROM customerOrder  ORDER BY orderid DESC LIMIT ${ req.query.search ? 0 :(+req.query.PageNo-1) * 10}, 13 `
        con.query(customerorderget,(err,result)=>{
         if(err) throw(err)
         else
         {
           
            result[0] && Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
                if(Object.entries(result[0]).length==key+1)
                {
                    
                    con.query(`select COUNT(*) as count from customerOrder  `,(err1,result1)=>{
                        if(err1)  throw (err1)
                        else
                        {
                         res.json({ "Data":result,"TableHead":Tablehead ,Count:result1[0].count})
                        }
                    })
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