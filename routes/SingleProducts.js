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
        getProduct=`select * from productattribute  where productid=${req.query.productId}`
        con.query(getProduct,(err1,result1)=>{
           if(err) throw (err)
           else
          {
           
           Object.values(result1).map((item,key)=>{
                    attributedetails=`select attributeName,( select value from attributevalue where id=${item.attributeValueId} ) as attributeval from attribute where id=${item.attributeId}`
                        
                    con.query(attributedetails,(err2,result2)=>{
                    if(err2) throw (err2)
                    else
                    {  
                        let att={[result2[0].attributeName]:{attributeId:item.attributeId,attributevalueId:item.attributeValueId,attributevalue:result2[0].attributeval}}
                        attributesarray.push(att)
                    }
                    
                    if(result1.length ==  key+1 )
                    {   
                      
                        
                        result[0].attributes=attributesarray
                        // console.log(result[0])
                        res.json({"product":result[0]})
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