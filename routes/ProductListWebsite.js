const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/viewCategoryProduct",function(req,res)
 {
     console.log(req.query.category)
    
    selectqr=` SELECT *,(SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) as image from products  where category='${req.query.category}  '`

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
  

          headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${req.query.productCategory};`

          con.query(headEdit,(err1,result1)=>{
              if(err1)  throw (err1)
              else
              {
                
                 res.json({ headProduct: result1 })
              }
          })
   

})
module.exports=router;