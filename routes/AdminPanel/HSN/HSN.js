
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
        UpdateHSN=`UPDATE hsn SET HSN_Code='${HSN_Code}',product='${Product}',cgst='${CGST}',sgst='${SGST}',igst='${IGST}',status='${status}' where id='${operationid}' `
        con.query(UpdateHSN,(err,result)=>{
            if(err) throw(err)
            else
            {
                res.json({"success":"HSN Updated successfully"})
            }
           })
    }
    else
    {
        HsnInsert=`insert into hsn (HSN_Code,product,cgst,sgst,igst,status) Values('${HSN_Code}','${Product}','${CGST}','${SGST}','${IGST}','${status}') `
        con.query(HsnInsert,(err,result)=>{
         if(err) throw(err)
         else
         {
             res.json({"success":"HSN added successfully"})
         }
        })
    }
})

router.get('/HSN/getData',(req,res)=>{
    let Tablehead=[]
    getHSN=`select * from hsn where HSN_Code LIKE '%${req.query.search}%' or Product LIKE '%${req.query.search}%' ORDER BY id DESC LIMIT ${(+req.query.PageNo-1) * 10}, 13 `
    
    con.query(getHSN,(err,result)=>{
        if(err)  throw (err)
        else
        {
            
            result[0] && Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
               
                if(Object.entries(result[0]).length==key+1)
                {
                       
                    con.query(`select COUNT(*) as count from hsn  `,(err1,result1)=>{
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


module.exports=router;