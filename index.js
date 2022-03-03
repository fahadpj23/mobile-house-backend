var express=require("express");
var app=express();
var cors=require("cors");
const upload=require('express-fileupload')
app.use(upload())
app.use(cors());
app.use(express.static('public')); 
app.use('products/images', express.static('images'));
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: false });   
const Homerouter=require('./routes/Home')
const SearchRouter=require('./routes/ProductSearch')
const Adminrouter=require('./routes/Admin')
const SingleProductrouter=require('./routes/SingleProducts')
const PlaceorderRouter=require('./routes/PlaceOrder')
const UserLoginRouter=require('./routes/UserLogin')
const CategoryViewallRouter=require('./routes/CategoryViewAll')
const OrderProductRouter=require('./routes/OrderProduct')
const OrderList=require('./routes/AdminPanel/OrderList')
const ProductList=require('./routes/AdminPanel/productlist')
const authentication=require('./routes/authentication/authentication')
const addProduct=require('./routes/productadd/Add')
const con=require('./database')
const path = require('path')

app.use(express.static(path.join(__dirname, 'products')))
app.use(ProductList)
app.use(Homerouter)
app.use(authentication)
app.use(SearchRouter)
app.use(Adminrouter)
app.use(SingleProductrouter)
app.use(PlaceorderRouter)
app.use(UserLoginRouter)
app.use(CategoryViewallRouter)
app.use(OrderProductRouter)
app.use(OrderList)
app.use(addProduct)
app.use(express.json())


app.get("/fake",function(req,res)
 {
    searchqr=`SELECT name,image,mrp,price FROM headset`
    con.query(searchqr,(err,result,fields)=>{

      if(err) throw(err);
      res.json( [result] )
      
  }) 
  
})
// app.post("/products",jsonParser,function(req,res)
// {
//     let id=req.params.id
//     // console.log(req.body.id)
//     let iddel=req.body.id;
//     delqr=`delete from product where id=${iddel}`
//     con.query(delqr,(err,result)=>{
//         if(err) throw (err);
//         else res.send("success")
//     })
//     })
    
    // app.post('/upload',function(req,res)
    // {
    //     console.log("sd")
    //     if(req.files===null)
    //     {
    //         return res.status(400)
    //     }
    //     else
    //     {
    //         console.log(req.files.file)
    //     const file=req.files.file
    //     file.mv(`../MobileHouse/mobilehouse/public/image/${file.name}`)
    //     }
    //     })

    

app.listen(process.env.PORT || 9000,function(){
    console.log("server started")
})


