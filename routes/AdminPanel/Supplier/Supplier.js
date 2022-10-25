

const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const validateToken=require("../../../middlewares/authmiddelware")
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  

const {check,validationResult}=require('express-validator');

router.post('/SupplierAdd',

parseUrlencoded,(req,res)=>{
    const supplier=req.body
    console.log(supplier)
    if(supplier.operation=="")
    {
        supplieraddquery=`insert into supplier (supplierName,phone,address,pincode,status)Values ('${supplier.supplierName}','${supplier.phone}','${supplier.address}','${supplier.pincode}','${supplier.status}')`
        console.log(supplieraddquery)
        con.query(supplieraddquery,(err,result)=>{
            if(err) throw (err)
            else
            {
                res.json({success:"supplier added successfully"})
            }
        })
    }
    else
    {
        suppliereditquery=`update supplier set supplierName='${supplier.supplierName}',phone='${supplier.phone}',address='${supplier.address}',pincode='${supplier.pincode}',status='${supplier.status}' where id='${supplier.operationid}'`
        console.log(suppliereditquery)
        con.query(suppliereditquery,(err,result)=>{
            if(err) throw (err)
            else
            {
                res.json({success:"supplier edited successfully"})
            }
        }) 
    }

})

router.get('/Supplier/getData',(req,res)=>{
    let Tablehead=[];
    getsupplierquery=`select * from supplier `
    con.query(getsupplierquery,(err,result)=>{
        if(err) throw (err)
        else
        {
            if(result==0)
            {
                let Tablehead=["SupplierName","phone","Address","pincode","status"];
            
                res.json({ "Data":result,"TableHead":Tablehead ,Count:0})
            }
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
           
       

        }
    })
})

module.exports=router;  