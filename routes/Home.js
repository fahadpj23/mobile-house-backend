const express=require('express')
const { commit } = require('../database')
const router = express.Router()
const con=require('../database')


router.get('/HomePageCategory',function(req,res){
 
    getatt='select * from category where status=1'
    con.query(getatt,(err,result)=>{
      if(err) throw (err)
      else
      { 
           res.json({category:result})
      }
    })
})
// router.get("/MobileHouseRecommend",function(req,res)
// {
//  con.query("SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productimage.productId = products.id) as image from products ORDER BY id DESC ",(err,result,fields)=>{
//      if(err) throw(err);
//      else
//      {
    
//        res.send(result)
//      }
//  }) 
 
// })

 


router.get("/getProductSliders",function(req,res)
{
  let products=[];
 con.query("SELECT * FROM head where status=1 ",(err,result)=>{
     if(err) throw(err);
     else
     {
      console.log(result)
      result &&  result.map((item,key)=>{
       
        headproduct=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image,variantid FROM products RIGHT JOIN headproduct ON headproduct.productid = products.id where  HeadId=${item.id};`
        console.log(headproduct)
        con.query(headproduct,(err1,result1)=>{
           if(err1) throw (err1)
           else
           {
            if(result1)
            {
              result[key].products=result1
            
            setTimeout(() => {
              if(result.length==key+1)
              {
                res.json({sliders:result})
              }
            }, 200);
            }
          }
          
         
        })
       })
     }
 }) 
})


router.get("/getBanner",function(req,res)
{
 con.query("SELECT * FROM banner  ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.json({banner:result})
     }
 }) 
})

router.get("/getAds",function(req,res)
{
  getads=`SELECT * FROM ads where status="1" `
 con.query(getads,(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
        result && result.map((item,key)=>{
          console.log(item.id)
            con.query(`select * from adsdetail where adsId='${item.id}'`,(err1,result1)=>{
              if(err1) throw (err1)
              else
              {
                console.log(result1)
                result[key].detail=result1
                if(result.length==key+1)
                {
                  res.json({Ads:result})
                }
              }
            })
        })
     }
 }) 
})



// router.get("/headset",function(req,res)
// {
//  con.query("SELECT * FROM headset",(err,result,fields)=>{
//      if(err) throw(err);
     
//      res.send(result)
//  }) 
 
// })
// router.get("/cover",function(req,res)
// {
//  con.query("SELECT * FROM cover",(err,result,fields)=>{
//      if(err) throw(err);
//      res.send(result)
//  })   
// })
// router.get("/access",function(req,res)
// {
//  con.query("SELECT * FROM access",(err,result,fields)=>{
//      if(err) throw(err);
    
//      res.send(result)
//  })   
// })
module.exports=router;