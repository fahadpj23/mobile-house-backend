const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/searchProduct",function(req,res)
 {
    // console.log(req.query.searchitem)
    
    searchqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty,Brand,HSN_code,Tax,category,Description,variantid,(select categoryName from category where category.id=products.category)as categoryName,(SELECT image from productimage where productimage.productId=products.id LIMIT 1) as image from products where name LIKE N'%${req.query.searchitem}%' LIMIT 5`
    
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      else
      {
        searchBrand=`select id,categoryName from category where categoryName LIKE N'%${req.query.searchitem}%' LIMIT 2`
        con.query(searchBrand,(err1,result1)=>{
            if(err1) throw (err1)
            else
            {
              searchBrand=`select DISTINCT Brand from products where Brand LIKE N'%${req.query.searchitem}%' LIMIT 2`
              con.query(searchBrand,(err2,result2)=>{
                  if(err2) throw (err2)
                  else
                  {
                    res.json({products:result,category:result1,Brand:result2})
                  }
              })
            }
        })
      }
      
  }) 
  
})
module.exports=router;  