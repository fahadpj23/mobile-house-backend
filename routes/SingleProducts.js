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
                        /
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
    let attributesarray=[];
    let variantproduct=[];
 variant=`select * from products where variantid='${req.query.variantid}'    `
 console.log(variant)
 
 con.query(variant,(err,result)=>{
    if(err) throw (err);
    else
    {
        result && Object.values(result).map((item,key)=>{
            getProduct=` SELECT group_concat(concat_ws(',', image) separator '; ') as image FROM productimage WHERE productId = ${item.id} `
            con.query(getProduct,(err,result1)=>{
               if(err) throw (err)
               else
              {

                result[key].image=result1[0].image
                getProduct=`select * from productattribute  where productid=${item.id}`
                
                con.query(getProduct,(err1,result2)=>{
                   if(err) throw (err)
                   else
                  {
                   
                   Object.values(result2).map((item,key1)=>{
                            attributedetails=`select attributeName,( select value from attributevalue where id=${item.attributeValueId} ) as attributeval from attribute where id=${item.attributeId}`
                                
                            con.query(attributedetails,(err2,result2)=>{
                            if(err2) throw (err2)
                            else
                            {  
                                let att={[result2[0].attributeName]:{attributeId:item.attributeId,attributevalueId:item.attributeValueId,attributevalue:result2[0].attributeval}}
                                attributesarray.push(att)
                                result[key].attributes=attributesarray
                                console.log(result)
                            }
                            
                            if(result2.length ==  key1+1 )
                            {   
                              
                                
                                item.attributes=attributesarray
                                if(Object.values(result).length==key+1)
                                {
                                    res.json({'variants':result})
                                }
                              
                            }
                       })
                   
                       })
        
                  }
                })
              }
             
            })
            console.log(Object.values(result).length)
            console.log(key)
           
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