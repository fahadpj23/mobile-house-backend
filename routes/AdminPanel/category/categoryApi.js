const express=require('express')
const router = express.Router()
const con=require('../../../database')
const validateToken=require("../../../middlewares/authmiddelware")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');

router.delete('/CategoryDelete',function(req,res){
  console.log(req.query)
  deleteCategory=`delete from category where id="${req.query.categoryId}" `
  console.log(deleteCategory)
  con.query(deleteCategory,(err,result)=>{
    if(err) throw (err)
    else
    {
      deleteCategoryattribute=`delete from categoryattribute where categoryId="${req.query.categoryId}" `
      console.log(deleteCategory)
      con.query(deleteCategoryattribute,(err,result)=>{
        if(err) throw (err)
        else
        {
          res.json({"success":"catgeory deleted successfully"})
        }
      })  
    }
  })
  
})
router.get('/getCategory',validateToken,function(req,res){
 

   let itemmodel=[];
     getatt='select * from category'
     con.query(getatt,(err,result)=>{
       if(err) throw (err)
       else
       {
        
         result.map((item,key)=>{
           getcatvalues=`select  * from categoryattribute where categoryId=${item.id}`
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
      
       
       
        itemmodel.push({id:category.id,categoryName:category.categoryName,image:category.image,status:category.status,values:categoryval})
        if(itemmodel.length==length)
        {
          let tablehead=['SlNo','categoryName','status','values']
           res.json({ "Data":itemmodel,"TableHead":tablehead })
        }
       
       
     }
 
  
  
   
 })

    router.post("/categoryAdd", parseUrlencoded,(req,res)=>
    {
      if(req.body.operation=="")
      {
            let file=req.files.image
            file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
            searchqr=`select Count(*) as  count from category where categoryName='${req.body.categoryName}'`

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
                   
                    addcatgeory=`insert into category (categoryName,image,status) values ('${req.body.categoryName}','${Math.round(new Date().getTime()/1000)}${file.name}','${req.body.status}')`
                   con.query(addcatgeory,(err,result1)=>{
                           if(err) throw (err);
                            else
                              {
                              
                                Object.values(attribute).length>0 &&  Object.values(attribute).map((item,key)=>{
                                  
                                    con.query(`select * from  attribute where attributeName='${item}'`,(err,result,fields)=>
                                    {
                                    
                                    if(err) throw(err);
                                    else
                                    {
                                
                                            
                                            addcatgeoryattribute=`insert into categoryattribute (categoryId,attributeId,attributeName) values ('${result1.insertId}','${ result[0].id}','${ result[0].attributeName}')`
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
      else
      {
        
        
        // let file=req.files.image
       
        // if( file)
        // {
      
        //   file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
        //   attributeUpdate=`UPDATE category SET categoryName='${req.body.categoryName}',image='${Math.round(new Date().getTime()/1000)}${file.name}' , status= ${req.body.status} WHERE id=${req.body.operationid}`

        // }
        // else
        // {
          
        attributeUpdate=`UPDATE category SET categoryName='${req.body.categoryName}', status= ${req.body.status} WHERE id=${req.body.operationid}`
        // }
        con.query(attributeUpdate,(err,result)=>{
          if(err) throw (err);
          else {
            
             deletequery=`DELETE FROM categoryattribute WHERE categoryId=${req.body.operationid}`
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
                                 
                                  
                                  addcatgeoryattribute=`insert into categoryattribute (categoryId,attributeId,attributeName) values ('${req.body.operationid}','${ result[0].id}','${ result[0].attributeName}')`
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

