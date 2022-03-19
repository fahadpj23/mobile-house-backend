const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../../database');
const { func } = require('react-globally');
const { Result } = require('express-validator');
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  


router.post("/productAdd",parseUrlencoded,function(req,res){
  let product=req.body
   console.log(req.body)
  const file=req.files.image

  file.mv(`products/images/${file.name}`)
  addqr=`insert into products (  name,  price, mrp ,warranty, image, Brand,qty ,category) values ('${product.Name}','${product.Price}','${product.MRP}','${product.Warranty}','${file.name}','${product.Brand}','${product.qty}','${product.category}')`;
  con.query(addqr,(err,result)=>{

    if(err) throw (err);
  else 
  {
    // addqr=`insert into products (  name,  price, mrp ,warranty, image, Brand,qty ,category) values ('${product.Name}','${product.Price}','${product.MRP}','${product.Warranty}','${file.name}','${product.Brand}','${product.qty}','${product.category}')`;
    columnfetch=`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ${product.category};`
    con.query(columnfetch,(err,result)=>{
      if(err) throw (err)
      else
      {
       result.map((item,key)=>{
         console.log(item)
       })
      }
     
    })
    console.log(result.insertId)
  }
})
})

router.get('/categoryAttribute',function(req,res){
 console.log(req.query)
  categoryAttribute=`select * from categoryvalue where categoryId="${req.query.categoryid}"`
  con.query(categoryAttribute,(err,result)=>{
    if(err) throw (err)
    else
      res.send(result)
  })
})
router.post('/uploadaccessories',function(req,res)
{
    let product=req.body
   
    const file=req.files.image
 
    file.mv(`products/images/${file.name}`)
    addqr=`insert into accessories ( productid, name,color,  price, mrp ,warranty, image, brand,type, maxqty, material ) values ('${product.productid}','${product.name}','${product.color}','${product.price}','${product.mrp}','${product.warranty}','${file.name}','${product.brand}','accessories','${product.maxqty}','${product.material}')`;
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else res.send("successfully added")
  })
    }
    
)



router.post('/uploadcover',function(req,res)
{
    let product=req.body
    console.log("name cover"+product.name)
    console.log("mrp"+product.mrp)
    const file=req.files.image
    console.log(file.name)
    file.mv(`products/images/${file.name}`)
    addqr=`insert into cover ( productid, name,color,  price, mrp ,warranty, image, brand,type, maxqty, material ) values ('${product.productid}','${product.name}','${product.color}','${product.price}','${product.mrp}','${product.warranty}','${file.name}','${product.brand}','cover','${product.maxqty}','${product.material}')`;
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else res.send("successfully added")
  })
}
)
router.post('/uploadHeadset',function(req,res)
{
    let product=req.body
    console.log("name cover"+product.name)
    console.log("mrp"+product.mrp)
    const file=req.files.image
    console.log(file.name)
    file.mv(`products/images/${file.name}`)
    addqr=`insert into headset ( productid, name,color,  price, mrp ,warranty, image, brand,type, maxqty, material,headsetType ) values ('${product.productid}','${product.name}','${product.color}','${product.price}','${product.mrp}','${product.warranty}','${file.name}','${product.brand}','headset','${product.maxqty}','${product.material}','${product.headsetType}')`;
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else res.send("successfully added")
  })
}
    
)
module.exports=router;