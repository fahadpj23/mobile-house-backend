const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
 const validateToken=require("../../../middlewares/authmiddelware");
 const {check,validationResult}=require('express-validator');
 var parseUrlencoded = bodyParser.urlencoded({ extended: true });  

// const {check,validationResult}=require('express-validator');

router.get('/purchaseProductSearch',(req,res)=>{
    let product=[];
    searchquery=`select * from products  where name LIKE '%${req.query.searchelement}%'`

    con.query(searchquery,(err,result)=>{
        if(err) throw (err)
        else
        // res.json({products:result})
        {
            if(result.length==0)
            {
                res.json({noProduct:"No Product Found"})
            }
            else
            {
             Object.values( result).map((item,key)=>{
                variant=`select * from productattribute  where id=${item.id}`
                con.query(variant,(err1,result1)=>{
                    if(err1) throw (err1)
                    else
                    {
                    let pro={...item,...result1[0]}
                    product.push(pro)
                   
                        if(Object.values( result).length==key+1)
                        {
                            res.json({products:product})
                        }
                    }
                
                })
               
            })
            }
        }
    })
})

router.post("/purchaseupload",
[
    check('invoiceno').notEmpty(),
    check('paymentMethod').notEmpty(),
    check('supplier').notEmpty(),
],
parseUrlencoded,(req,res)=>{
    const error=validationResult(req);
    if(error.errors.length!=0)
    {
       
      return res.json({error:error.errors})
    }
    else
    {
    purchase=req.body
    purchaseinsertquery=`insert into purchase (invoiceNo,paymentMethod,supplier,productNo,TaxAmount,otherExpense,grandTotal) values ( '${purchase.invoiceno}','${purchase.paymentMethod}','${purchase.supplier}','${ JSON.parse( purchase.products).length}','${purchase.TaxAmount}','${purchase.otherexpense}','${purchase.GrandTotal}')`
    con.query(purchaseinsertquery,(err,result)=>{
        if(err)throw(err)
        else
        {
            console.log(result.insertId)
            JSON.parse( purchase.products).map((item,key)=>{
               purchaseproductquery=`insert into purchaseproduct (purchaseId,product) values ( '${result.insertId}','${item}')`
               con.query(purchaseproductquery,(err1,result1)=>{
                   if(err1) throw (err1)
                   else
                   {
                      if(JSON.parse( purchase.products).length==key+1)
                      {
                          res.json({success:"purchase added successfully"})
                      }
                   }
               })
            })
        }
    })
    }
})



module.exports=router;  