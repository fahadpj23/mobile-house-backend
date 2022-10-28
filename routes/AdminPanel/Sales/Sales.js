const express=require('express')
const router=express.Router()
const con=require('../../../database')

router.get('/Sales/getData',(req,res)=>{
    console.log(req.cookies)
    let Tablehead=[];
    getpurchase=` select id,invoice,invoiceDate,CustomerName,CustomerPhone,NoProduct,subTotal,TaxAmount,GrandTotal,PaymentMethod,status from sales where invoice LIKE '%${req.query.search}%' ORDER BY sales.id DESC LIMIT ${(+req.query.PageNo-1) * 10}, 13 `
    con.query(getpurchase,(err,result)=>{
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

module.exports=router