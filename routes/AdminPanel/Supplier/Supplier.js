

const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const validateToken=require("../../../middlewares/authmiddelware")
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  

const {check,validationResult}=require('express-validator');

router.post('/SupplierAdd',
[
    check('name').notEmpty(),
    check('phone').notEmpty(),
    check('Address').notEmpty(),
    check('Pincode').notEmpty(),
    check('status').notEmpty(),
],
parseUrlencoded,(req,res)=>{
    const supplier=req.body
    const error=validationResult(req);
    if(error.errors.length!=0)
          {
         
          return res.json({error:error.errors})
          }
    else
    {
        supplieraddquery=`insert into supplier (supplierName,phone,address,pincode,status)Values ('${supplier.name}','${supplier.phone}','${supplier.Address}','${supplier.Pincode}','${supplier.status=="active" ? 1 : 0}')`
        con.query(supplieraddquery,(err,result)=>{
            if(err) throw (err)
            else
            {
                res.json({success:"supplier added"})
            }
        })
    }

})

router.get('/getSupplier',(req,res)=>{
    let Tablehead=[];
    getsupplierquery=`select * from supplier `
    con.query(getsupplierquery,(err,result)=>{
        if(err) throw (err)
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