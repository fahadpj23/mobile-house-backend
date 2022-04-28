const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
// const validateToken=require("../../../middlewares/authmiddelware")
// var parseUrlencoded = bodyParser.urlencoded({ extended: true });  

// const {check,validationResult}=require('express-validator');

router.get('/purchaseProductSearch',(req,res)=>{
    let product=[];
    searchquery=`select * from products  where name LIKE '%${req.query.searchelement}%'`

    con.query(searchquery,(err,result)=>{
        if(err) throw (err)
        else
        // res.json({products:result})
        {
            if(result.length==0)
            {
                res.json({noProduct:"No Product Found"})
            }
            else
            {
             Object.values( result).map((item,key)=>{
                variant=`select * from productattribute  where id=${item.id}`
                con.query(variant,(err1,result1)=>{
                    if(err1) throw (err1)
                    else
                    {
                    let pro={...item,...result1[0]}
                    product.push(pro)
                   
                        if(Object.values( result).length==key+1)
                        {
                            res.json({products:product})
                        }
                    }
                
                })
               
            })
            }
        }
    })
})



module.exports=router;  