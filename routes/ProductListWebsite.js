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
module.exports=router;