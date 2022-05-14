
const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');
const command = require('nodemon/lib/config/command');


router.post('/HSNcodePost',parseUrlencoded,(req,res)=>{
  const{HSN_Code,Product,CGST,SGST,IGST,status,operation,operationid}=req.body
    if(operation)
    {

    }
    else
    {
        HsnInsert=`insert into hsn (HSN,product,cgst,sgst,igst,status) Values('${HSN_Code}','${Product}','${CGST}','${SGST}','${IGST}','${status=="active" ? 1 : 0}') `
        con.query(HsnInsert,(err,result)=>{
         if(err) throw(err)
         else
         {
             res.json({"success":"HSN added successfully"})
         }
        })
    }
})

router.get('/getHSN',(req,res)=>{
    let Tablehead=[]
    con.query('select * from hsn',(err,result)=>{
        if(err)  throw (err)
        else
        {
            Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
            })
            res.json({ "Data":result,"TableHead":Tablehead })
        }
    })
})


module.exports=router;