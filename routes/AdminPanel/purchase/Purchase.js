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
    console.log(req.query.searchval)
    let product=[];
    searchquery=`select * from products  where name LIKE '%${req.query.searchval}%' limit 20`
    console.log(searchquery)
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

router.get('/getsupplier',(req,res)=>{
    fetchsupplier=`select id,supplierName from supplier`
    con.query(fetchsupplier,(err,result)=>{
        if(err) throw (err)
        else
        res.json({supplier:result})
    })
})

router.get('/Purchase/getData',(req,res)=>{
    let Tablehead=[];
    getpurchase=`select * from purchase`
    con.query(getpurchase,(err,result)=>{
        if(err) throw (err)
        else
        {
            if(result.length==0)
           {
            let Tablehead=["id","invoiceNo","supplier","NoProduct","grandTotal"];
            
                 res.json({ "Data":result,"TableHead":Tablehead ,Count:0})
               
           }
           else
           {
            Object.entries(result[0]).map((item,key)=>{
                if(item[0]!="TaxAmount" && item[0]!="otherExpense")
                Tablehead.push(item[0])
              
                
            })

            getsupplier=`select * from purchase where id='${result[0].id}'`
                     
                     con.query(getsupplier,(err1,result1)=>{
                         if(err1) throw (err1)
                         else
                         if(result1.length)
                            result[0].supplier=result1[0].supplierName
                        res.json({ "Data":result,"TableHead":Tablehead ,Count:0})
                     })
           
            }
        }
    })
})

router.post("/purchaseupload",
[
    check('invoiceno').notEmpty(),
    check('invoiceDate').notEmpty(),
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

    //insert into purchase details then add purchase product details
    purchaseinsertquery=`insert into purchase (invoiceNo,invoiceDate,paymentMethod,supplier,NoProduct,GSTAmount,otherExpense,grandTotal) values ( '${purchase.invoiceno}','${purchase.invoiceDate}','${purchase.paymentMethod}','${purchase.supplier}','${ JSON.parse( purchase.products).length}','${purchase.TaxAmount}','${purchase.otherexpense}','${purchase.GrandTotal}')`
    con.query(purchaseinsertquery,(err,result)=>{
        if(err)throw(err)
        else
        {
            console.log(result.insertId)
            JSON.parse( purchase.products).map((item,key)=>{
                //update qty of product
                purchaseproductquery=`insert into purchaseproduct (purchaseid,productid,price,mrp,qty,gst,subtotal,gstAmt,netAmt) values ( '${result.insertId}','${item.id}','${item.purchasePrice}','${item.mrp}','${item.productqty}','${item.Tax}','${+item.purchasePrice * item.productqty}','${item.taxAmount}','${item.netAmount}')`
                con.query(purchaseproductquery,(err1,result1)=>{
                    if(err1) throw (err1)
                    else
                    {
                        productselect=`select * from products where id=${item.id} `
                        con.query(productselect,(err3,result3)=>{
                            if(err3) throw (err3)
                            else
                            {
                            updateQtyQuery=`UPDATE products SET qty=${result3[0].qty + item.productqty} where id=${result3[0].id}`
                            con.query(updateQtyQuery,(err4,result4)=>{
                                if(err4) throw (err4)
         
         
                            })
                            }
                        })  
                       if(JSON.parse( purchase.products).length==key+1)
                       {
                           res.json({success:"purchase added successfully"})
                       }
                    }
                })
              
               //purchased items add to table
              
            })
        }
    })
    }
})



module.exports=router;  