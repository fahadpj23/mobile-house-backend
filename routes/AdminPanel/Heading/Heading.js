
const express=require('express')
const router = express.Router()
const con=require('../../../database')

var bodyParser=require("body-parser");
const validateToken = require('../../../middlewares/authmiddelware');
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  





router.get('/head/getData',validateToken,(req,res)=>{
    let Tablehead=[]
    con.query(`select * from head where Heading LIKE '%${req.query.search}%' `,(err,result)=>{
        if(err)  throw (err)
        else
        {
           
            result[0] && Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
                if(Object.entries(result[0]).length==key+1)
                {
                           res.json({ "Data":result,"TableHead":Tablehead })  
                }
            })
     
        }
    })
})
router.get('/editGetHead',validateToken,(req,res)=>{
    headdetails=`select * from head where id=${req.query.HeadingId}`
    con.query(headdetails,(err,result)=>{
        if(err)  throw (err)
        else
        {
            headEdit=`SELECT  (SELECT id from products where products.id=headproduct.productid) as id ,(SELECT name from products where products.id=headproduct.productid) as name, (SELECT sellingPrice from products where products.id=headproduct.productid) as sellingPrice, (SELECT salesPrice from products where products.id=headproduct.productid) as salesPrice ,(SELECT mrp from products where products.id=headproduct.productid) as mrp ,(SELECT variantid from products where products.id=headproduct.productid) as variantid ,(SELECT image from productimage where productimage.productId=headproduct.productid LIMIT 1) as image from headproduct where HeadId=${req.query.HeadingId};`

            con.query(headEdit,(err1,result1)=>{
                if(err)  throw (err)
                else
                {
                  result[0].products=result1
                   res.json({ headEdit: result })
                }
            })
     
        }
    })

   
})

router.get('/headProduct',validateToken,(req,res)=>{
    console.log(req.query)
    con.query(`select id,name ,sellingprice,(SELECT  image FROM productimage WHERE productimage.productId = products.id LIMIT 1) as image from products where name LIKE '%${req.query.searchitem}%' `,(err,result)=>{
        if(err)throw (err)
        else
        {
            res.json({ products :result})
        }
    })
})

router.post('/headingAdd',validateToken,parseUrlencoded,(req,res)=>{
    if(req.body.operation=="")
    {
        products=JSON.parse(req.body.products)
        headAdd=`insert into head (Heading,status,NoProduct) Values ('${req.body.head}','${req.body.status}','${products.length}')`
        console.log(headAdd)
        con.query(headAdd,(err,result)=>{
            if(err)throw (err)
            else
            {
            products && products.map((item,key)=>{
                productAdd=`insert into headproduct (HeadId,productId) values( '${result.insertId}','${item.id}')`
                con.query(productAdd,(err1,result1)=>{
                    if(err1) throw (err)
                    else
                    {
                        if(products.length==key+1)
                        {
                            res.json({success:"head addedd successfully"})
                        }
                    }
                })
            })

               
            }
        })
    }
    if(req.body.operation=="edit")
    {
        products=JSON.parse(req.body.products)
        console.log(products)
        headAdd=`UPDATE head SET Heading='${req.body.head}',status=${req.body.status}, NoProduct='${products.length}' where id=${req.body.operationid}`
        
        con.query(headAdd,(err,result)=>{
            if(err)throw (err)
            else
            {
              deleteHeadProduct=`delete from headproduct where HeadId=${req.body.operationid}`
              con.query(deleteHeadProduct,(err2,result2)=>{
                if(err2) throw (err2)
                else
                {
                    products && products.map((item,key)=>{
                        productAdd=`insert into headproduct (HeadId,productId) values( '${req.body.operationid }','${item.id}')`
                        con.query(productAdd,(err1,result1)=>{
                          if(err1) throw (err)
                          else
                          {
                              if(products.length==key+1)
                              {
                                  res.json({success:"head addedd successfully"})
                              }
                          }
                        })
                      })
           
                }
              })
              
              
            }
        })
    }
})




module.exports=router;