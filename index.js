var express=require("express");
var app=express();
var cors=require("cors");
const upload=require('express-fileupload')
var session = require('express-session');
const cookieParser = require('cookie-parser');

const port=process.env.PORT || 9000

const con=require('./database')
const path = require('path')
app.use(upload())

app.use(cors());
// app.use(session({
//   secret: 'yoursecret',
//   cookie: {
//       path: '/',
//       domain: process.env.COOKIE_URL,
//       maxAge: 1000 * 60 * 24 // 24 hours
//   }
// }));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.use(express.static('public')); 
app.use('products/images', express.static('images'));
app.use(cookieParser());

const payment=require('./routes/Payment/Payment')
const Homerouter=require('./routes/Home')
const ProductListWebsite=require('./routes/ProductListWebsite')
const SearchRouter=require('./routes/ProductSearch')
const Adminrouter=require('./routes/Admin')
const SingleProductrouter=require('./routes/SingleProducts')
const PlaceorderRouter=require('./routes/PlaceOrder')
const UserLoginRouter=require('./routes/UserLogin')
const CategoryViewallRouter=require('./routes/CategoryViewAll')
const OrderProductRouter=require('./routes/OrderProduct')
const cart=require('./routes/cart')
const sales=require('./routes/AdminPanel/Sales/Sales')
// const OrderList=require('./routes/AdminPanel/OrderList')
// const ProductList=require('./routes/AdminPanel/productlist')
const authentication=require('./routes/authentication/authentication')
const addProduct=require('./routes/AdminPanel/productadd/Add')

const category=require('./routes/AdminPanel/category/categoryApi')
const attribute=require('./routes/AdminPanel/attribute/attribute')
const Purchase=require('./routes/AdminPanel/purchase/Purchase')
const Supplier=require('./routes/AdminPanel/Supplier/Supplier')
const HSN=require('./routes/AdminPanel/HSN/HSN')
const Heading=require('./routes/AdminPanel/Heading/Heading')
const Banner=require('./routes/AdminPanel/Banner/Banner')
const Ads=require('./routes/AdminPanel/Ads/Ads')
const order=require('./routes/AdminPanel/order/order')
const profile=require('./routes/profile')
const OrderDetails=require('./routes/OrderDetails')
 app.use(express.static(path.join(__dirname, 'products')))
// app.use(ProductList)
app.use(Homerouter)
app.use(authentication)
app.use(SearchRouter)
app.use(Adminrouter)
app.use(SingleProductrouter)
app.use(PlaceorderRouter)
app.use(UserLoginRouter)
app.use(CategoryViewallRouter)
app.use(OrderProductRouter)
// app.use(OrderList)
app.use(addProduct)
app.use(Heading)
app.use(category)
app.use(express.json())
app.use(attribute)
app.use(ProductListWebsite)
app.use(Purchase)
app.use(Supplier)
app.use(HSN)
app.use(Banner)
app.use(Ads)
app.use(cart)
app.use(order)
app.use(profile)
app.use(payment)
app.use(sales)
app.use(OrderDetails)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});



