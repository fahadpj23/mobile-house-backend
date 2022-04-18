const express=require('express')
const router = express.Router()
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const con=require('../database')
const {check,validationResult}=require('express-validator');

router.get("/orderDetails",function(req,res)
 {
    // console.log(req.query.searchitem)
    
    singleqr=`SELECT * FROM products where id="${req.query.productId}"`

    con.query(singleqr,(err,result,fields)=>{
    if(err)throw (err);
    else
    {
        
        singleproductattribute=`SELECT * FROM productattribute where id="${req.query.productId}" `  
        con.query(singleproductattribute,(err1,result1)=>{
           if(err) throw (err)
           else
           {
                
            let val={...result[0],...result1[0]}
                      
           
           
                res.send(val)
            
               
           }
        })
       
    }
    
})
  
})

router.post("/customerOrders",
[
    check('name').notEmpty(),
    check('phone').notEmpty(),
    check('pincode').notEmpty(),
    check('address').notEmpty(),
    
  ],
jsonParser,function(req,res)
    {
        const{name,phone,pincode,address}=req.body
        
        const UTCTime = new Date() 
        const time = UTCTime.toLocaleTimeString()
        const date= UTCTime.toDateString()
        const orderdate=time+date
        const error=validationResult(req);
        console.log(error.errors)
        if(error.errors.length!=0)
        {
            console.log("fdddddddd")
        return res.json({error:error.errors})
        }
        else
        {
        
            let orderinfo=req.body;
            let products=JSON.parse(orderinfo.product)
            addqr=`insert into productorder ( date, customername, phone, pincode, address,orderCount ) values ('${orderdate}','${orderinfo.name}','${orderinfo.phone}','${orderinfo.pincode}','${orderinfo.address}','${Object.values( products).length}')`;
                con.query(addqr,(err,result)=>{

                if(err) throw (err);
                else 
                {
                
                    Object.values( products).map((item,key)=>{
                    
                    productDetail=`insert into orderdetails (orderId,productid,qty) values('${result.insertId}','${item.id}','${item.qty}')`
                    con.query(productDetail,(err1,result1)=>{
                        if(err1) throw (err1)
                        else
                        {
                            productselect=`select * from products where id=${item.id}`
                            con.query(productselect,(err2,result2)=>{
                                if(err2) throw (err2)
                                else
                                {
                                    let qty=result2[0].qty - item.qty
                                    qtyupdate=`UPDATE  products SET qty="${qty}" WHERE id="${item.id}" ` 
                                    con.query(qtyupdate,(err3,result3)=>{
                                        if(err2) throw (err2)
                                        else
                                        {
                                            if( Object.values( products).length== key+1)
                                            {
                                                res.json({"orderId":result.insertId})
                                            } 
                                        }
                                    })
                                }
                            })
                        
                        }
                    })
                    })
                }
                
            })
            
        
    }  
    }
    )

module.exports=router;