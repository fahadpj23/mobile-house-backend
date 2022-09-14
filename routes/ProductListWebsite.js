const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/viewCategoryProduct",function(req,res)
 {

    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    
    selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where category='${req.query.category}' ORDER BY ${sortColumn} ${sort}  `
   
    con.query(selectqr,(err,result,fields)=>{

      if(err) throw(err);
      else
      {
          res.send(result)
      }
  }) 
  
})

// router.get("/ProductList",function(req,res)
//  {

//     let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
//     let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    
//     selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where (CASE WHEN '${req.query.type}'='Search' THEN name LIKE N'%${req.query.searchValue}%' ELSE ${req.query.type}='${req.query.productList}' END)  ORDER BY ${sortColumn} ${sort}  `
//     console.log(selectqr)
//     con.query(selectqr,(err,result,fields)=>{

//       if(err) throw(err);
//       else
//       {
//         console.log(result)
//           res.send(result)
//       }
//   }) 
  
// }) 
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
    viewBrandProduct=`SELECT   id , name,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where products.Brand="${req.query.Brand}"  ORDER BY id DESC`
        //   headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct  where products.Brand="${req.query.Brand}"  ORDER BY ${sortColumn} ${sort}`
          con.query(viewBrandProduct,(err1,result1)=>{
              if(err1)  throw (err1)
              else
              {
                
                 res.json({ brandProduct: result1 })
              }
          })
   

})

router.get("/viewSerachValueProduct",function(req,res)
 { 
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    viewSearchProduct=`SELECT   id , name,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where  name LIKE N'%${req.query.searchValue}%'  ORDER BY id DESC`
          con.query(viewSearchProduct,(err1,result1)=>{
              if(err1)  throw (err1)
              else
              {
                
                 res.json({ viewSearchProduct: result1 })
              }
          })
   

})

module.exports=router;