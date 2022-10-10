require('dotenv').config()
const { application } = require('express')
const express=require('express')
const router = express.Router()
const con=require('../../database')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const stripe=require('stripe')(process.env.STRIPE_PRIVATE_KEY)





router.post('/create-checkout-session',parseUrlencoded,async (req,res)=>{
    try {
        
        let productsdetails=JSON.parse(req.body.items)
        console.log(productsdetails)
        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            line_items:productsdetails.map(item=>{
                const storeItem=item.id
                return{
                    price_data:{
                        currency:'INR',
                        product_data:{
                            name:item.name
                        },
                        unit_amount:(item.salesPrice??item.sellingPrice)*100
                    },
                    quantity:item.qty??1
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