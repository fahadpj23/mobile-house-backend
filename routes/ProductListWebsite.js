const express=require('express')
const router = express.Router()
const con=require('../database')

router.get("/productList/category",function(req,res)
 {

    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 
    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"
    let price=req.query.minprice ? req.query.minprice :0
    let Brand=req.query.BND=="NOBRAND" ? "'NOBRAND'"   : req.query.BND 
    console.log(req.query.BND)
    
    // selectqr=`SELECT id,name,sellingPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where (CASE WHEN 0!0 THEN category='${req.query.category}' END) ORDER BY ${sortColumn} ${sort}  `
    selectqr=`SELECT id, (SELECT COUNT(*) from products where category='${req.query.category}' and  IF   ("${Brand}"="'NOBRAND'" , category='${req.query.category}' ,Brand in (${Brand})   ) and   products.sellingPrice BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} and products.salesPrice  BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} ) as count, name,(SELECT MAX(sellingPrice) from products where category='${req.query.category}' )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where category='${req.query.category}' )as MaxsalesPrice,salesPrice,mrp,warranty,qty as maxqty,Brand,HSN_code,Tax,category,Description,variantid,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image from products where category='${req.query.category}' and  IF   ("${Brand}"="'NOBRAND'" , category='${req.query.category}' ,Brand in (${Brand})   ) and   products.sellingPrice BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} and products.salesPrice  BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000}  ORDER BY ${sortColumn} ${sort} LIMIT ${(req.query.PageNo ? +req.query.PageNo-1 : 1) * 10}, 20 `
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
          res.json({products:result,Brand:result1,TotalProduct:result[0]?.count??0})
          }
        })
      }
  }) 
  
})


router.get("/productList/productCategory",function(req,res)
 {
   //select column for sorting
    let sortColumn= (req.query.sort=="newestfirst") ? "id" :  "sellingPrice" 

    let sort=(req.query.sort=="Price-Low-to-High") ? "ASC" : "DESC"

          headProduct=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(select COUNT(*)from headproduct where HeadId=${req.query.productCategory} )as count,(SELECT name from products where products.id=headproduct.productid) as name,(SELECT MAX(sellingPrice) from products where products.id=headproduct.productid )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where products.id=headproduct.productid )as MaxsalesPrice, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${req.query.productCategory}  ORDER BY ${sortColumn} ${sort}  LIMIT ${(+req.query.PageNo-1) * 10}, 30`
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
                 res.json({products:result,Brand:result1,TotalProduct:result[0] && result[0].count})
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
  let price=req.query.minprice ? req.query.minprice :0
  let Brand=req.query.BND=="NOBRAND" ? "'NOBRAND'"   : req.query.BND 
  console.log(req.query.PageNo)
    viewBrandProduct=`SELECT   id ,(SELECT   COUNT(*) from products where products.Brand="${req.query.Brand}" )as count, name,(SELECT MAX(sellingPrice) from products where products.Brand="${req.query.Brand}" )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where products.Brand="${req.query.Brand}" )as MaxsalesPrice,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where products.Brand="${req.query.Brand}" and  IF   ("${Brand}"="'NOBRAND'" , Brand="${req.query.Brand}" ,Brand in (${Brand})   ) and   products.sellingPrice BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000} and products.salesPrice  BETWEEN ${req.query.minprice ? req.query.minprice : 0} AND ${req.query.maxprice ? req.query.maxprice :5000000000000000}   ORDER BY ${sortColumn} ${sort} LIMIT ${(req.query.PageNo ? +req.query.PageNo-1 : 1) * 10}, 20 `
        //   headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct  where products.Brand="${req.query.Brand}"  ORDER BY ${sortColumn} ${sort}`
        console.log(viewBrandProduct) 
        con.query(viewBrandProduct,(err,result)=>{
              if(err)  throw (err)
              else
              {
               
                Brandqr=`   SELECT DISTINCT  Brand from products  where products.Brand="${req.query.Brand}"  `
        
                con.query(Brandqr,(err1,result1,fields1)=>{
                    
                  if(err1) throw(err1);
                  else
                  {
                  res.json({products:result,Brand:result1,TotalProduct:result[0] && result[0].count})
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
    viewSearchProduct=`SELECT   id , (SELECT   COUNT(*) from products where    name LIKE N'%${req.query.searchitem}%' )as count,name,(SELECT MAX(sellingPrice) from products where   name LIKE N'%${req.query.searchitem}%' )as MaxsellingPrice,(SELECT MAX(salesPrice) from products where   name LIKE N'%${req.query.searchitem}%' )as MaxsalesPrice,  sellingPrice, salesPrice , mrp ,variantid ,(SELECT IF ((SELECT EXISTS(SELECT * FROM productimage WHERE imagePosition = 1 and productimage.productId = products.id) as result) = 1 , (SELECT image FROM productimage WHERE imagePosition = 1 AND productimage.productId = products.id) , (SELECT image FROM productimage WHERE productimage.productId = products.id LIMIT 1) )  ) as image  from products  where  name LIKE N'%${req.query.searchitem}%'   ORDER BY ${sortColumn} ${sort}  LIMIT ${(req.query.PageNo ? +req.query.PageNo-1 : 1) * 10}, 20 `
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
                  res.json({products:result,Brand:result1,TotalProduct:result[0] && result[0].count})
                  }
                })
                //  res.json({ products: result1 })
              }
          })
   

})

module.exports=router;