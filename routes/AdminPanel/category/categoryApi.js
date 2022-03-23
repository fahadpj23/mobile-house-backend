const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');
const { object } = require('react-globally');

router.get('/getCategory',function(req,res){
  

   let itemmodel=[];
     getatt='select * from category'
     con.query(getatt,(err,result)=>{
       if(err) throw (err)
       else
       {
        //  result.map((item,key)=>{
        //    getcatvalues=`select  * from categoryvalue where categoryId=${item.id}`
        //    con.query(getcatvalues,(err1,result1)=>{
        //      if(err1) throw (err1)
        //      else
        //        setcategory(item,result1,result.length)
        //    })
        //  })
        res.send(result)
       }
     })
 
     function setcategory(category,categoryvalues,length)
     {
      console.log(length)
       let categoryval=[];
 
       categoryvalues.map((item,key)=>{
        categoryval.push(item.value)
       })
      
       
       
        itemmodel.push({id:category.id,categoryname:category.categoryName,status:category.status==1 ?"active" : "disable" ,values:categoryval})
        if(itemmodel.length==length)
        {
          res.send(itemmodel )
        }
       
       
     }
 
   console.log(itemmodel)
  
   
 })

    router.post("/categoryAdd",
    [
        check('name').notEmpty(),
        check('status').notEmpty(),
        
      ],
    parseUrlencoded,(req,res)=>
    {
        const error=validationResult(req);
        if(!error.isEmpty)
        return res.json({error:error.array})
        else
        {
            searchqr=`select Count(*) as  count from category where categoryName='${req.body.name}'`

                con.query(searchqr,(err,result)=>{
                if(result[0].count>0)
                {
                    res.json({"error":"category already exist"})
                }
                else
                { 
                    let attributes=[];
                    const{name,status}=req.body
                    let attribute=JSON.parse(req.body.categoryvalues)
                   
                    addcatgeory=`insert into category (categoryName,status) values ('${req.body.name}','${req.body.status=="active" ? 1 : 0}')`
                   con.query(addcatgeory,(err,result1)=>{
                           if(err) throw (err);
                            else
                              {
                              // createtable=`create table ${req.body.name}(id int) `
                              // con.query(createtable,(err1,result1)=>{
                              //     if(err) throw (err)
                              // })
                                Object.values(attribute).length>0 &&  Object.values(attribute).map((item,key)=>{
                                    // columninsert=`Alter table ${req.body.name} add ${item} varchar(255)`
                                    // con.query(columninsert,(err,result,fields)=>
                                    // {
                                    
                                    // if(err) throw(err);
                                    // })
                                    con.query(`select * from  attribute where attributeName='${item}'`,(err,result,fields)=>
                                    {
                                    
                                    if(err) throw(err);
                                else
                                {
                                
                                            
                                            addcatgeoryattribute=`insert into categoryvalue (categoryId,attributeId,attributeName) values ('${result1.insertId}','${ result[0].id}','${ result[0].attributeName}')`
                                            con.query(addcatgeoryattribute,(err,result)=>{
                                                if(err) throw (err);
                                                else {
                                                
                                                    if(attribute.length== key+1)
                                                    res.json({success:"success"})
                                                
                                                }
                                        
                                        })
                                    
                                }
                            
                                    })
                                })
                            }
                            })
                            

                }
            })                                                                           
                                                                                    

        }

    })

    
   
  

module.exports=router;

