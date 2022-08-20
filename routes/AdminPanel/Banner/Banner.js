
const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');
const command = require('nodemon/lib/config/command');

// add  banner
router.post('/AddBanner',parseUrlencoded,(req,res)=>{
    //ther is no edit in banner so delete all banner before update
    deleteBanner=`truncate table banner`
    con.query(deleteBanner,(err1,result1)=>{
        if(err1) throw (err1)
        else
        {
            //json data parse
            images=JSON.parse(req.body.images)
     
            images && images.map((item,key)=>{
                
                
                let file= req.files["image" + (key+1)]
                
                file && file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
                bannerimageAdd=`insert into banner (position,image) values ( '${key+1}','${Math.round(new Date().getTime()/1000)}${file.name}')`
                con.query(bannerimageAdd,(err,result)=>{
                    if(err) throw (err)
                    else
                        if(images.length==key+1)
                        {
                            res.json({"success":"banner added successfully"})
                        }
                })

            })
                }
            })
            

})


//Table data in Banner page
router.get('/banner/getData',validateToken,(req,res)=>{
    console.log("fdfd")
    let Tablehead=[]
    con.query(`select * from banner where id LIKE '%${req.query.search}%'`,(err,result)=>{
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


module.exports=router;