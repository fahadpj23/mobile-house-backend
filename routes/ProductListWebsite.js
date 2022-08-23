const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/viewCategoryProduct",function(req,res)
 {
    console.log(req.query)
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    
    selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where category='${req.query.category}' ORDER BY ${sortColumn} ${sort}  `
    console.log(selectqr)
    con.query(selectqr,(err,result,fields)=>{

      if(err) throw(err);
      else
      {
          res.send(result)
      }
  }) 
  
})

router.get("/viewSliderProduct",function(req,res)
 {
   //select column for sorting
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 

    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"

          headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${req.query.productCategory}  ORDER BY ${sortColumn} ${sort};`

          con.query(headEdit,(err1,result1)=>{
              if(err1)  throw (err1)
              else
              {
                
                 res.json({ headProduct: result1 })
              }
          })
   

})
router.get("/viewBrandProduct",function(req,res)
 { 
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
 
          headEdit=`SELECT  id,name,sellingPrice,salesPrice,mrp,warranty,qty,Brand,HSN_code,Tax,category,Description,variantid,,(SELECT image from productimage where productimage.productId=products.id LIMIT 1) as image  from products where Brand="${req.query.Brand}"  ORDER BY ${sortColumn} ${sort}`
          con.query(headEdit,(err1,result1)=>{
              if(err1)  throw (err1)
              else
              {
                
                 res.json({ brandProduct: result1 })
              }
          })
   

})
module.exports=router;