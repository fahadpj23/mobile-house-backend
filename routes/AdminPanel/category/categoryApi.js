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
        
         result.map((item,key)=>{
           getcatvalues=`select  * from categoryvalue where categoryId=${item.id}`
           con.query(getcatvalues,(err1,result1)=>{
             if(err1) throw (err1)
             else
             setcategory(item,result1,result.length)

           })
         })
       
       }
     })
 
     function setcategory(category,categoryvalues,length)
     {
      console.log(categoryvalues)
       let categoryval=[];
      
       categoryvalues.map((item,key)=>{
        let attributeId=item.attributeId
        let  attributeName=item.attributeName
        categoryval.push(item.attributeName)
       })
      
       
       
        itemmodel.push({id:category.id,Name:category.categoryName,status:category.status==1 ?"active" : "disable" ,values:categoryval})
        if(itemmodel.length==length)
        {
          let tablehead=['SlNo','category Name','status','values']
           res.json({ "Data":itemmodel,"TableHead":tablehead })
        }
       
       
     }
 
  
  
   
 })

    router.post("/categoryAdd",
    [
        check('name').notEmpty(),
        check('status').notEmpty(),
        
      ],
    parseUrlencoded,(req,res)=>
    {
      if(req.body.operation=="")
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
      }
      else
      {
        console.log("dsds")
        console.log(req.body.operationid)
        console.log(req.body.categoryvalues)
        attributeUpdate=`UPDATE category SET categoryName='${req.body.name}', status= ${req.body.status=="active" ? 1 : 0} WHERE id=${req.body.operationid}`
        con.query(attributeUpdate,(err,result)=>{
          if(err) throw (err);
          else {
            
             deletequery=`DELETE FROM categoryvalue WHERE categoryId=${req.body.operationid}`
             con.query(deletequery,(err,result)=>{
               if(err) throw (err)
               else
               {


                JSON.parse(req.body.categoryvalues).length>0 &&  JSON.parse(req.body.categoryvalues).map((item,key)=>{
                      
                      con.query(`select * from  attribute where attributeName='${item}'`,(err,result,fields)=>
                      {
                      
                      if(err) throw(err);
                      else
                      {
                        // console.log(item)
                                  
                                  addcatgeoryattribute=`insert into categoryvalue (categoryId,attributeId,attributeName) values ('${req.body.operationid}','${ result[0].id}','${ result[0].attributeName}')`
                                  con.query(addcatgeoryattribute,(err,result)=>{
                                      if(err) throw (err);
                                      else {
                                      
                                          if(JSON.parse(req.body.categoryvalues).length== key+1)
                                          res.json({"success":"success"})
                                      
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

