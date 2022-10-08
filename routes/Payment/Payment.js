require('dotenv').config()
const { application } = require('express')
const express=require('express')
const router = express.Router()
const con=require('../../database')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const stripe=require('stripe')(process.env.STRIPE_PRIVATE_KEY)

const storeItems= new Map([
    [1,{price:4552,name:"screen Guard"}],
    [2,{price:788 ,name:"back cover"}]
])



router.post('/create-checkout-session',parseUrlencoded,async (req,res)=>{
    try {
        console.log(stripe)
        let productsdetails=JSON.parse(req.body.items)
        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:productsdetails.map(item=>{
                const storeItem=storeItems.get(item.id)
                return{
                    price_data:{
                        currency:'INR',
                        product_data:{
                            name:storeItem.name
                        },
                        unit_amount:storeItem.price
                    },
                    quantity:item.quantity
                }
            }),
            success_url:'http://localhost:3000/',
            cancel_url:'http://localhost:3000/AboutUs'
        })
    
    res.json({url:session.url})
    }catch(e){
        res.status(500).json({error:e.message})
    }
   
})

module.exports=router