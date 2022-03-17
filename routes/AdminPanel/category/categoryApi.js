const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');
const { object } = require('react-globally');

router.get("/getAttribute",(req,res)=>
    {
       
        categorysearchqr=`SELECT * FROM attribute`
            con.query(categorysearchqr,(err,result,fields)=>
            {
            
            if(err) throw(err);
            res.send(result)
       
             })

    })
    router.post("/categoryAdd",
    [
        check('name').notEmpty(),
        check('status').notEmpty(),
        
      ],
    parseUrlencoded,(req,res)=>
    {
        if(!error.isEmpty)
        return res.json({error:error.array})
        else
        {
        let attributes=[];
        const{name,status}=req.body
        let attribute=JSON.parse(req.body.attributevalues)
        addcatgeory=`insert into category (categoryName,status) values ('${req.body.name}','${req.body.status=="active" ? 1 : 0}')`
            con.query(addcatgeory,(err,result1)=>{
                if(err) throw (err);
                else
                {
                    Object.values(attribute).map((item,key)=>{
                        con.query(`select * from  attribute where attributeName='${item}'`,(err,result,fields)=>
                        {
                        
                        if(err) throw(err);
                       else
                       {
                       
                                
                                addcatgeoryattribute=`insert into categoryvalue (categoryId,attributeId,attributeName) values ('${result1.insertId}','${ result[0].id}','${ result[0].attributeName}')`
                                con.query(addcatgeoryattribute,(err,result)=>{
                                    if(err) throw (err);
                                    else {
                                        
                                        console.log("sasssa")
                                    
                                    }
                            
                            })
                           
                       }
                   
                         })
                    })
                }
                })
                
       

            }

    })

    
   
  

module.exports=router;