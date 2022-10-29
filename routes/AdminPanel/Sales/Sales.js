const express=require('express')
const router=express.Router()
const con=require('../../../database')
const validateToken=require('../../../middlewares/authmiddelware')
router.get('/Sales/getData',(req,res)=>{
    console.log(req.cookies)
    let Tablehead=[];
    getsales=` select id,invoice,invoiceDate,CustomerName,CustomerPhone,NoProduct,subTotal,TaxAmount,GrandTotal,PaymentMethod,status from sales where invoice LIKE '%${req.query.search}%' ORDER BY sales.id DESC LIMIT ${(+req.query.PageNo-1) * 10}, 13 `
    con.query(getsales,(err,result)=>{
        if(err) throw (err)
        else
        {
            if(result.length==0)
           {
            let Tablehead=["id","invoice","invoiceDate","CustomerName","CustomerPhone","NoProduct","subTotal","TaxAmount","GrandTotal","PaymentMethod","status"];
            
                 res.json({ "Data":result,"TableHead":Tablehead ,Count:0})
               
           }
           else
           {
            Object.entries(result[0]).map((item,key)=>{
                if(item[0]!="TaxAmount" && item[0]!="CustomerPhone" && item[0]!="subTotal" )
                     Tablehead.push(item[0])
                
                if(Object.entries(result[0]).length==key+1)
                {
                    TotalCount=`select COUNT(*) as count from sales WHERE invoice LIKE '%${req.query.search}%'`
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



router.get('/salesProductSearch',(req,res)=>{
    console.log(req.query.searchval)
    let product=[];
    searchquery=`select id as productId,name,sellingPrice as price,mrp,Tax from products  where name LIKE '%${req.query.searchval}%' limit 20`
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

//api call when edit or view call in sales.used for load products
router.get('/getSalesProduct',validateToken,(req,res)=>{
    fetchpurchaseProduct=`select * from salesproduct where salesId=${req.query.salesId}`
    con.query(fetchpurchaseProduct,(err,result)=>{
        if(err)  throw (err)
        else
        {
            res.json({products:result})
        }

    })
})

// sales Uplaod
router.post("/salesUpload",validateToken,
(req,res)=>{
    
    sales=req.body
    console.log(req.body)
    if(sales.operation)
    {
        salesupdatequery=`UPDATE  sales SET invoice='${sales.invoice}',invoiceDate='${sales.invoiceDate}',paymentMethod='${sales.paymentMethod}',CustomerName='${sales.CustomerName}',CustomerPhone='${sales.CustomerPhone}',NoProduct='${ JSON.parse( sales.products).length}',subTotal='${sales.subTotal}',TaxAmount='${sales.TaxAmount}',GrandTotal='${sales.GrandTotal}',status='${1}' where id='${sales.operationId}'`
        console.log(salesupdatequery)
        con.query(salesupdatequery,(err,result)=>{
            if(err)throw(err)
            else
            {
                //when edit delete all product and insert again
                deleteproduct=`delete from salesproduct where salesId='${sales.operationId}'`
                con.query(deleteproduct,(err2,result2)=>{
                    if(err2)  throw (err2)
                    else
                    {
                         //salesd items add to table
                        JSON.parse( sales.products).map((item,key)=>{
                           
                            salesproductquery=`insert into salesproduct (salesid,productid,name,price,mrp,qty,Tax,subtotal,taxAmount,netAmount) values ( '${sales.operationId}','${item.productId}','${item.name}','${item.price}','${item.mrp}','${item.qty}','${item.Tax}','${+item.subTotal}','${item.taxAmount}','${item.netAmount}')`
                            console.log(salesproductquery)
                            con.query(salesproductquery,(err1,result1)=>{
                                if(err1) throw (err1)
                                else
                                {
                              
                                if(JSON.parse( sales.products).length==key+1)
                                    {
                                    res.json({success:"sales added successfully"})
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
        const UTCTime = new Date() 
        const time = UTCTime.toLocaleTimeString()
        const date= UTCTime.toDateString()
        const salesdate=date+","+time
        salesinsertquery=`insert into sales (CustomerName,CustomerPhone,NoProduct,subTotal,TaxAmount,GrandTotal,PaymentMethod,status) values ( '${sales.customerName ? sales.customerName :"unknown" }','${sales.customerPhone ? sales.customerPhone :"0"}','${ JSON.parse( sales.products).length}','${sales.subTotal}','${sales.TaxAmount}','${sales.GrandTotal}','${sales.PaymentMethod}','${1}')`
        console.log(salesinsertquery)
        con.query(salesinsertquery,(err,result)=>{
            if(err)throw(err)
            else
            {
               //after insert set invoice number as database id
                salesinvoiceupdate=`Update sales set invoice='${"MH"+result.insertId }',invoiceDate='${salesdate}'  where sales.id='${result.insertId}'`
                con.query(salesinvoiceupdate,(err3,result3)=>{
                    if(err3) throw (err3)
                    else
                    {

                    //add sales product to sales product table
                    JSON.parse( sales.products).map((item,key)=>{
                       
                        salesproductquery=`insert into salesproduct (salesId,productId,name,price,mrp,qty,subTotal,taxAmount,netAmount) values ( '${result.insertId}','${item.productId}','${item.name}','${item.price}','${item.mrp}','${item.qty}','${+item.subTotal}','${item.taxAmount}','${item.netAmount}')`
                        con.query(salesproductquery,(err1,result1)=>{
                            if(err1) throw (err1)
                            else
                            {
                        
                            if(JSON.parse( sales.products).length==key+1)
                                {
                                res.json({success:"sales added successfully"})
                            }
                            }
                        })
                
                
                })
                }
            })
            }
            })
    }
  
})


module.exports=router