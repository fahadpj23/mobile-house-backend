const express=require('express')

const router = express.Router()
const con=require('../database')


//get the single product detail
router.get("/singleview",function(req,res)
{
   
    if(req.query.productId)
    {
    // getProduct=` SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productId = ${req.query.productId}) as image from products where id=${req.query.productId}`
    getProduct=` SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT group_concat(image ORDER BY imagePosition ASC separator '; ') FROM productimage WHERE productId = ${req.query.productId} ) as image from products where id=${req.query.productId}`
    console.log(getProduct)
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
        {
       
        productattribute=`select *,(select attributeName from attribute where productattribute.attributeId=attribute.id ) as attributeName ,(select value  from attributevalue where attributevalue.id=productattribute.attributeValueId ) as attributeValue from productattribute where productid=${req.query.productId} ORDER BY attributeName ASC`
        console.log(productattribute)
        con.query(productattribute,(err1,result1)=>{
           if(err) throw (err)
           else
            {
                    if(result[0])
                            {
                            result[0].attributes=result1 ? result1 : []
                            res.json({"product":result[0]})
                            }
                    else
                    {
                        res.json({"error":"no Product"})
                    }

                
            }
        })
      }
    })
    }
    else
    {
        res.json({error:"something went wrong"})
    }

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
    //select all varainat related to product using variantid.all product have their own varinatid
    variant=`select id,category,(SELECT  image FROM productimage WHERE productimage.productId = products.id ORDER BY imagePosition ASC LIMIT 1 ) as image from products where variantid='${req.query.variantid}'  `
    
    con.query(variant,(err,result)=>{
    if(err) throw (err);
    else
    {
         
            Object.values(result).map((item,key)=>{
                // here select attribute,attribute name,attribute value,attrubute value id, attach to product depends on check attribute id is needed for variant show if varaiant 1 then select else reject selection
                productattribute=`select DISTINCT *,(select attributeName from attribute where productattribute.attributeId=attribute.id ) as attributeName ,(select value  from attributevalue where attributevalue.id=productattribute.attributeValueId ) as attributeValue from productattribute where productid=${item.id} and productattribute.attributeId=(select attributeId from categoryattribute where variant=1 and categoryId=${item.category} and categoryattribute.attributeId=productattribute.attributeId) ORDER BY productattribute.attributeId  `
                console.log(productattribute)
                con.query(productattribute,(err1,result1)=>{
                    if(err1) throw (err1)
                    else
                    {
                        let val={id:item.id, category:item.category, image:item.image, attributes:result1}
                       
                        
                        attributesarray.push(val)
                        setTimeout(() => {
                            if( Object.values(result).length == key+1)
                            {
                                res.json({variants:attributesarray})
                            }
                        }, 200);
                       
                  
                        
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

 related=`SELECT *,(SELECT  image FROM productimage WHERE productimage.productId = products.id ORDER BY imagePosition ASC LIMIT 1) as image  FROM products where category="${req.query.category}" and variantid != '${req.query.variantid}' LIMIT 12`  
 
 con.query(related,(err,result,fields)=>{
    if(err) throw(err);
    res.json({relatedProduct:result})
})

})
module.exports=router;