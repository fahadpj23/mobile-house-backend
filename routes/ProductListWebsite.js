const express=require('express')
const router = express.Router()
const con=require('../database')
router.get("/viewCategoryProduct",function(req,res)
 {

    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    let price=req.query.minprice ? req.query.minprice :0
    let Brand=req.query.BND ? req.query.BND : "'NOBRAND'"
    console.log(Brand)
    
    // selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where (CASE WHEN 0!0 THEN category='${req.query.category}' END) ORDER BY ${sortColumn} ${sort}  `
    selectqr=`SELECT id,name,(SELECT MAX(sellingPrice) from products where category='${req.query.category}' )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where category='${req.query.category}' )as MaxsalesPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where category='${req.query.category}' and  IF   ("${Brand}"="'NOBRAND'" , category ,Brand in (${Brand})   ) and   products.sellingPrice BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} and products.salesPrice  BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000}  ORDER BY ${sortColumn} ${sort}  `
    console.log(selectqr)
    con.query(selectqr,(err,result,fields)=>{

      if(err) throw(err);
      else
      {
        Brandqr=`SELECT DISTINCT Brand from products where category='${req.query.category}'  `
        
        con.query(Brandqr,(err1,result1,fields1)=>{
            
          if(err1) throw(err1);
          else
          {
          res.json({products:result,ProductBrand:result1})
          }
        })
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

router.get("/productList/category",function(req,res)
 {

    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    let price=req.query.minprice ? req.query.minprice :0
    let Brand=req.query.BND ? req.query.BND : "'NOBRAND'"
    console.log(Brand)
    
    // selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where (CASE WHEN 0!0 THEN category='${req.query.category}' END) ORDER BY ${sortColumn} ${sort}  `
    selectqr=`SELECT id,name,(SELECT MAX(sellingPrice) from products where category='${req.query.category}' )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where category='${req.query.category}' )as MaxsalesPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where category='${req.query.category}' and  IF   ("${Brand}"="'NOBRAND'" , category ,Brand in (${Brand})   ) and   products.sellingPrice BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} and products.salesPrice  BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000}  ORDER BY ${sortColumn} ${sort}  `
    console.log(selectqr)
    con.query(selectqr,(err,result,fields)=>{

      if(err) throw(err);
      else
      {
        Brandqr=`SELECT DISTINCT Brand from products where category='${req.query.category}'  `
        
        con.query(Brandqr,(err1,result1,fields1)=>{
            
          if(err1) throw(err1);
          else
          {
          res.json({products:result,Brand:result1})
          }
        })
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
router.get("/productList/productCategory",function(req,res)
 {
   //select column for sorting
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 

    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"

          headProduct=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name,(SELECT MAX(sellingPrice) from products where products.id=headproduct.productid )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where products.id=headproduct.productid )as MaxsalesPrice, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${req.query.productCategory}  ORDER BY ${sortColumn} ${sort};`
         console.log(headProduct)
          con.query(headProduct,(err,result)=>{
              if(err)  throw (err)
              else
              {
              
               Brandqr=` SELECT DISTINCT (SELECT Brand from products where products.id=headproduct.productid) as Brand from headproduct where HeadId=${req.query.productCategory}   `
               console.log(Brandqr)
               con.query(Brandqr,(err1,result1,fields1)=>{
                   
                 if(err1) throw(err1);
                 else
                 {
                 res.json({products:result,Brand:result1})
                 }
               })
               //   res.json({ products: result1 })
              }
          })
   

})
router.get("/productList/Brand",function(req,res)
 { 
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    viewBrandProduct=`SELECT   id , name,(SELECT MAX(sellingPrice) from products where products.Brand="${req.query.Brand}" )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where products.Brand="${req.query.Brand}" )as MaxsalesPrice,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where products.Brand="${req.query.Brand}"  ORDER BY id DESC`
        //   headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct  where products.Brand="${req.query.Brand}"  ORDER BY ${sortColumn} ${sort}`
          con.query(viewBrandProduct,(err,result)=>{
              if(err)  throw (err)
              else
              {
               
                Brandqr=`   SELECT DISTINCT  Brand from products  where products.Brand="${req.query.Brand}"  `
        
                con.query(Brandqr,(err1,result1,fields1)=>{
                    
                  if(err1) throw(err1);
                  else
                  {
                  res.json({products:result,Brand:result1})
                  }
                })
                //  res.json({ products: result1 })
              }
          })
   

})

router.get("/productList/searchitem",function(req,res)
 { 
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    viewSearchProduct=`SELECT   id , name,(SELECT MAX(sellingPrice) from products where   name LIKE N'%${req.query.searchitem}%' )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where   name LIKE N'%${req.query.searchitem}%' )as MaxsalesPrice,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where  name LIKE N'%${req.query.searchitem}%'  ORDER BY id DESC`
         console.log(viewSearchProduct)  
    con.query(viewSearchProduct,(err,result)=>{
              if(err)  throw (err)
              else
              {
               
                Brandqr=`  SELECT DISTINCT  Brand from products where  name LIKE N'%${req.query.searchitem}%'  `
        
                con.query(Brandqr,(err1,result1,fields1)=>{
                    
                  if(err1) throw(err1);
                  else
                  {
                  res.json({products:result,Brand:result1})
                  }
                })
                //  res.json({ products: result1 })
              }
          })
   

})

module.exports=router;