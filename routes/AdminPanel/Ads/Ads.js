
const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');



router.post('/AddAds',validateToken,parseUrlencoded,(req,res)=>{
    
        console.log(req.body.operation)
        if(req.body.operation=="")
        {
            AdsImageArray=JSON.parse(req.body.AdsImageArray)
            adsadd=`insert into ads (status) values (${req.body.status})`
            con.query(adsadd,(err,result)=>{
                if(err) throw (err)
                else
                {
                        console.log(result.insertId)
                        AdsImageArray && AdsImageArray.map((item,key)=>{
                            
                            let file= req.files["image" + (key+1)]
                            
                            file && file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
                            AdsimageAdd=`insert into adsdetail (adsId,position,image,Brand) values ( '${result.insertId}','${item.position}','${Math.round(new Date().getTime()/1000)}${file.name}','${item.Brand}')`
                            con.query(AdsimageAdd,(err1,result1)=>{
                                if(err1) throw (err1)
                                else
                                    if(AdsImageArray.length==key+1)
                                    {
                                        res.json({"success":"Ads added successfully"})
                                    }
                            })
            
                        })
                }
            })
        }
        if(req.body.operation=="edit")
        {
            AdsImageArray=JSON.parse(req.body.AdsImageArray)
            adsadd=`UPDATE  ads SET status=${req.body.status}`
            con.query(adsadd,(err,result)=>{
                if(err) throw (err)
                else
                {
                        console.log(AdsImageArray)
                        AdsImageArray && AdsImageArray.map((item,key)=>{
                            AdsBrandUpdate=`UPDATE adsdetail SET Brand='${item.Brand}' where position='${item.position}'`
                          
                            con.query(AdsBrandUpdate,(err1,result1)=>{
                                if(err1) throw (err1)
                                
                                    
                            })
                            if(item.imageBlob!="")
                            {
                                let file= req.files["image" + (key+1)]
                                
                                file && file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
                                AdsimageUpdate=`UPDATE adsdetail SET image='${Math.round(new Date().getTime()/1000)}${file.name}' where position='${item.position}'`
                                console.log(AdsimageUpdate)
                                con.query(AdsimageUpdate,(err1,result1)=>{
                                    if(err1) throw (err1)
                                    
                                        
                                })
                            }
                            if(AdsImageArray.length==key+1)
                                        {
                                            res.json({"success":"Ads added successfully"})
                                        }
                        })
                }
            })
        }
    
               

})


router.get('/getAdsData',validateToken,(req,res)=>{
   let Tablehead=["SLNO","status"];
    con.query('SELECT id,status FROM ads',(err,result)=>{
        if(err)  throw (err)
        else
        {
            // result.length!=0 && Object.entries(result[0]).map((item,key)=>{
            //     Tablehead.push(item[0])
            // })
           
            res.json({ "Data":result,"TableHead":Tablehead })
            console.log(result.length)
        }
    })
})

router.get('/getAdsBrand',validateToken,(req,res)=>{
 
    con.query('SELECT Brand FROM products GROUP BY Brand',(err,result)=>{
        if(err)  throw (err)
        else
        {
           res.json({Brand:result})
        }
    })
})
router.get('/getAdsEdit',validateToken,(req,res)=>{
 
    con.query(`SELECT status FROM ads where id=${req.query.id}`,(err,result)=>{
        if(err)  throw (err)
        else
        {
            con.query(`select image,brand from adsdetail details where adsId='${req.query.id}'`,(err2,result2)=>{
                if(err2) throw (err2)
                else
                {
                    result[0].details=result2
                    res.json({AdsDetails:result})
                }
            })
            
        }
    })
    console.log(req.query)
})



module.exports=router;