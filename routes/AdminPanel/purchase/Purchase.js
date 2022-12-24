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
    searchquery=`select id as productId,name,purchasePrice as price,mrp,Tax from products  where name LIKE '%${req.query.searchval}%' limit 20`
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
            
                            res.json({products:result})
            
            }
        }
    })
})


//api used for fetch suppliers from supplier table 
router.get('/getsupplier',(req,res)=>{
    fetchsupplier=`select id,supplierName from supplier`
    con.query(fetchsupplier,(err,result)=>{
        if(err) throw (err)
        else
        res.json({supplier:result})
    })
})

//api call when edit or view call in purchase.used for load products
router.get('/getPurchaseProduct',validateToken,(req,res)=>{
    fetchpurchaseProduct=`select * from purchaseproduct where purchaseId=${req.query.purchaseId}`
    con.query(fetchpurchaseProduct,(err,result)=>{
        if(err)  throw (err)
        else
        {
            res.json({products:result})
        }

    })
})

router.get('/Purchase/getData',(req,res)=>{
    console.log(req.cookies)
    let Tablehead=[];
    getpurchase=` select id,invoiceNo,InvoiceDate,paymentMethod,supplier,(select supplierName from supplier where id=purchase.supplier) as supplierName,NoProduct,GSTAmount,otherExpense,grandTotal,ApprovalStatus from purchase where invoiceNo LIKE '%${req.query.search}%' ORDER BY purchase.id DESC LIMIT ${(+req.query.PageNo-1) * 10}, 13 `
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
                if(item[0]!="TaxAmount" && item[0]!="otherExpense" && item[0]!="ApprovalStatus")
                    item[0]=="supplier" ? Tablehead.push("supplierName")   : Tablehead.push(item[0])
                
                if(Object.entries(result[0]).length==key+1)
                {
                    TotalCount=`select COUNT(*) as count from purchase WHERE invoiceNo LIKE '%${req.query.search}%'`
                    con.query(TotalCount,(err1,result1)=>{
                        if(err1) throw (err1)
                        else
                        {
                            res.json({ "Data":result,"TableHead":Tablehead ,Count:result1[0].count})
                        }
                    })
                }
                    
                   
                
            })

           
            }
        }
    })
})


//update purchase approval status.inventory stock update when purchase approve
router.post('/UpdatePurchaseApprovalStatus',validateToken,(req,res)=>{
    
    console.log(req.body)
    updateApprovalStatus=`Update purchase set ApprovalStatus='${req.body.approvalStatus}' where id='${req.body.purchaseId}'`
    con.query(updateApprovalStatus,(err,result)=>{
        if(err) throw (err)
        else
        {
            //purchase is approved then chnage product qty based on purchase product (approval status 3 means purchase approved)
            if(req.body.approvalStatus=3)
            {
                selectprodutfrompurchase=`select * from purchaseproduct where purchaseId='${req.body.purchaseId}'`
                con.query(selectprodutfrompurchase,(err2,result2)=>{
                        if(err2) throw (err2)
                        else
                        {
                            result2 && result2.map((item,key)=>{
                                updateproductqty=`UPDATE products SET qty=+products.qty + ${item.qty} where id='${item.productId}'`
                               
                                con.query(updateproductqty,(err3,result3)=>{ 
                                    if(err3) throw (err3)
                                    else
                                    {
                                        if(result2.length==key+1 )
                                          res.json({success:"updated successfully"})
                                    }
                                })
                            })
                        }
                })
            }
            else
                res.json({success:"updated successfully"})
        }
    })
})


//purchase upload
router.post("/purchaseupload",validateToken,
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
    console.log(req.body)
    if(purchase.operation)
    {
        purchaseupdatequery=`UPDATE  purchase SET invoiceNo='${purchase.invoiceno}',invoiceDate='${purchase.invoiceDate}',paymentMethod='${purchase.paymentMethod}',supplier='${purchase.supplier}',NoProduct='${ JSON.parse( purchase.products).length}',GSTAmount='${purchase.TaxAmount}',otherExpense='${purchase.otherexpense}',grandTotal='${purchase.GrandTotal}',ApprovalStatus='${1}' where id='${purchase.operationId}'`
        console.log(purchaseupdatequery)
        con.query(purchaseupdatequery,(err,result)=>{
            if(err)throw(err)
            else
            {
                //when edit delete all product and insert again
                deleteproduct=`delete from purchaseproduct where purchaseId='${purchase.operationId}'`
                con.query(deleteproduct,(err2,result2)=>{
                    if(err2)  throw (err2)
                    else
                    {
                         //purchased items add to table
                        JSON.parse( purchase.products).map((item,key)=>{
                           
                            purchaseproductquery=`insert into purchaseproduct (purchaseid,productid,name,price,mrp,qty,Tax,subtotal,taxAmount,netAmount) values ( '${purchase.operationId}','${item.productId}','${item.name}','${item.price}','${item.mrp}','${item.qty}','${item.Tax}','${+item.subTotal}','${item.taxAmount}','${item.netAmount}')`
                            console.log(purchaseproductquery)
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
    }
    else
    {
        purchaseinsertquery=`insert into purchase (invoiceNo,invoiceDate,paymentMethod,supplier,NoProduct,GSTAmount,otherExpense,grandTotal,ApprovalStatus) values ( '${purchase.invoiceno}','${purchase.invoiceDate}','${purchase.paymentMethod}','${purchase.supplier}','${ JSON.parse( purchase.products).length}','${purchase.TaxAmount}','${purchase.otherexpense}','${purchase.GrandTotal}','${1}')`
        console.log(purchaseinsertquery)
        con.query(purchaseinsertquery,(err,result)=>{
            if(err)throw(err)
            else
            {
                console.log(result.insertId)
                JSON.parse( purchase.products).map((item,key)=>{
                    //update qty of product
                    purchaseproductquery=`insert into purchaseproduct (purchaseid,productid,name,price,mrp,qty,Tax,subtotal,taxAmount,netAmount) values ( '${result.insertId}','${item.productId}','${item.name}','${item.price}','${item.mrp}','${item.qty}','${item.Tax}','${+item.subTotal}','${item.taxAmount}','${item.netAmount}')`
                    con.query(purchaseproductquery,(err1,result1)=>{
                        if(err1) throw (err1)
                        else
                        {
                        //     productselect=`select * from products where id=${item.productId} `
                        //     con.query(productselect,(err3,result3)=>{
                        //         if(err3) throw (err3)
                        //         else
                        //         {
                        //         updateQtyQuery=`UPDATE products SET qty=${result3[0].qty + item.qty} where id=${result3[0].id}`
                        //         con.query(updateQtyQuery,(err4,result4)=>{
                        //             if(err4) throw (err4)
            
            
                        //         })
                        //         }
                        //     })  
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
  }
})



module.exports=router;  