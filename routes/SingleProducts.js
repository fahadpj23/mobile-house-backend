const express=require('express')

const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/singleview",function(req,res)
{
    let attributesarray=[];
    getProduct=` SELECT *,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productId = ${req.query.productId}) as image from products where id=${req.query.productId}`
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
      {
        productattribute=`select *,(select attributeName from attribute where productattribute.attributeId=attribute.id ) as attributeName ,(select value  from attributevalue where attributevalue.id=productattribute.attributeValueId ) as attributeValue from productattribute where productid=${req.query.productId}`
        con.query(productattribute,(err1,result1)=>{
           if(err) throw (err)
           else
          {
           
       
                    
                        console.log(result1)
                        result[0].attributes=result1
                        res.json({"product":result[0]})
                    

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
    let attributesarray=[];
    let variantproduct=[];
    variant=`select id,category,(SELECT  image FROM productimage WHERE productimage.productId = products.id LIMIT 1) as image from products where variantid='${req.query.variantid}'  `
    con.query(variant,(err,result)=>{
    if(err) throw (err);
    else
    {
            Object.values(result).map((item,key)=>{
                
                productattribute=`select *,(select attributeName from attribute where productattribute.attributeId=attribute.id   ) as attributeName ,(select value  from attributevalue where attributevalue.id=productattribute.attributeValueId ) as attributeValue from productattribute where productid=${item.id} and productattribute.attributeId=(select attributeId from categoryattribute where variant=1 and categoryId=${item.category} and categoryattribute.attributeId=productattribute.attributeId)  `
            
                con.query(productattribute,(err1,result1)=>{
                    if(err1) throw (err1)
                    else
                    {
                        result[key].attributes=result1
                        
                        if( Object.values(result).length == key+1)
                        {
                            res.json({variants:result})
                        }
                        
                    }
                })
            })
       
    
    }
})
})

router.get("/categoryVariant",function(req,res)
{
 categoryVariant=`select attributeId,(select attributeName from attribute where categoryattribute.attributeId=attribute.id ) as attributeName from categoryattribute where categoryId='${req.query.category}' and variant="1"`
 con.query(categoryVariant,(err,result)=>{
    if(err) throw (err);
    else res.json({categoryVariant:result})
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