const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../database')

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