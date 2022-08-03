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
router.get("/MobileHouseRecommend",function(req,res)
{
 con.query("SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productimage.productId = products.id) as image from products ORDER BY id DESC ",(err,result,fields)=>{
     if(err) throw(err);
     else
     {
    
       res.send(result)
     }
 }) 
 
})

 


router.get("/getProductSliders",function(req,res)
{
  let products=[];
 con.query("SELECT * FROM head where status=1 ",(err,result)=>{
     if(err) throw(err);
     else
     {
    
      result &&  result.map((item,key)=>{
       
        headproduct=`SELECT *,productid as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${item.id};`
        
        con.query(headproduct,(err1,result1)=>{
         
            result[key].products=result1
            if(result.length==key+1)
            {
              res.json({sliders:result})
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