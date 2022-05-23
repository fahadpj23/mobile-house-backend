const express=require('express')

const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/singleview",function(req,res)
{
   let attributevalue=[];
  
    singleqr=`SELECT * FROM products  where products.id='${req.query.productId}'  `
    console.log(singleqr)
    con.query(singleqr,(err,result,fields)=>{
    if(err)throw (err);
    else
    {
       
        copy=Object.assign(result[0])
        singleproductattribute=`SELECT * FROM productattribute where id="${req.query.productId}" `  
       
        con.query(singleproductattribute,(err1,result1)=>{
           if(err) throw (err)
           else
           {
              
           
               Object.entries(result1[0]).map((item,key)=>{
                   if(item[0]!="id" && item[1]!=null)
                   {
                   
                       attributevalue.push(item)
                      
                       
                   }
                 
                  
                   
               })
               console.log(attributevalue)
               attributevalue.map((item,key)=>{
               
                con.query(`select value from attributevalue where id=${item[1]}`,(err2,result2)=>{
                    if(err2) throw (err2)
                    else
                    {
                        console.log(result2)
                        if(result2[0])
                        {
                            val={attributeId:item[1],attributeValue:result2[0].value}
                        
                            result[0][item[0]]=val
                            if(attributevalue.length== key+1)
                            {
                                res.send(result[0])
                            }
                        }
                    }
               })
               })
             
               
               
           }
        })
       
    }
    
})

})
router.get("/pincodecheck",function(req,res)
{
 pinsearch=`select COUNT(*) as count from pincode where pincode='${req.query.pincodeno}'`
 con.query(pinsearch,(err,result)=>{
    if(err) throw (err);
    else 
    {
        if(result[0].length>0)
        {
            res.json({availability:"available"})
        }
        else
        {
            res.json({availability:"notavailable"})  
        }
    }
   
})
})
router.get("/variantproduct",function(req,res)
{
   
 variant=`select * from products where variantid='${req.query.variantid}'    `
 
 let variantproduct=[];
 con.query(variant,(err,result)=>{
    if(err) throw (err);
    else
    {
        result && Object.values(result).map((item,key)=>{
            variantattribute=`select * from productattribute where id='${item.id}' `
        con.query(variantattribute,(err1,result1)=>{
            if(err1) throw (err1)
            else
            {

                //  console.log(result1[0])
                
           
                    Object.entries(result1[0]).map((item1,key1)=>{
                     
                        attributevalue=`select value from attributevalue where id='${item1[1]}' `
                        con.query(attributevalue,(err2,result2)=>{
                            if(err2) throw (err2)
                            else
                            {
                               
                              if(item1[0]!="id")
                              {
                                 result1[0][item1[0]]= {attributeId:item1[1],attributeValue:result2[0] ? result2[0].value :undefined}
                                if( Object.entries(result1[0]).length== +key1 +1)
                                {
                                    
                                    let val={...item,...result1[0]}
                                    variantproduct.push(val)
                                    if(Object.entries(result).length ==key+1)
                                    {
                                        res.send(variantproduct)
                                    }
                                }
                               
                              }
                            }
                        })
                       

                    })
                   
               
            }
        })
        })
        
    
    }
})
})


router.get("/pincode",function(req,res)
{
 pinsearch=`select * from pincode where pincode='${req.query.pincodeno}'`
 con.query(pinsearch,(err,result)=>{
    if(err) throw (err);
    else res.send(result)
})
})
router.get("/related",function(req,res)
{
   
 related=`SELECT * FROM products where name="${req.query.name}" and category="${req.query.category}" and id != '${req.query.productId}'`  
 
 con.query(related,(err,result,fields)=>{
    if(err) throw(err);
    res.send(result)
})

})
module.exports=router;