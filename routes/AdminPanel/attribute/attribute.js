const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const validateToken=require("../../../middlewares/authmiddelware")
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  

const {check,validationResult}=require('express-validator');

router.post('/attributeAdd',validateToken,

parseUrlencoded,function(req,res)
{

 //check attribute update or add
  if(req.body.operation=="")
  {
 
    //check attribute name already exist or not when add new attribute
    searchqr=`select Count(*) as  count from attribute where attributeName='${req.body.attributeName}'`

    con.query(searchqr,(err,result)=>{
      if(result[0].count>0)
      {
        res.json({"error":"attribute already exist"})
      }
      else
      {
        //add new column to product attribute  table
       
        //add attribute in to attribute table
        addattribute=`insert into attribute (attributeName,status) values ('${req.body.attributeName}','${req.body.status}')`
  
        con.query(addattribute,(err,result)=>{
          if(err) throw (err);
          else {
            // loop the attributes and add to attribute value table one by one
            if(JSON.parse(req.body.attributevalues).length!=0)
            {
                let insertvalues=""
                JSON.parse(req.body.attributevalues).map((item,key)=>{
                  if(JSON.parse(req.body.attributevalues).length!= key+1)
                  {
                  insertvalues=insertvalues+("("+ "'"  +result.insertId + "'" +  ","   + "'" +item + "'"+ ")" + ",")
                  }
                  else
                  {
                    insertvalues=insertvalues+("("+ "'"  +result.insertId + "'" +  ","   + "'" +item + "'"+ ")" )
                  }
                })
                // query for add attribute value to attribute value table
                valueaddquery=`insert into attributevalue (attributeid,value) values ${insertvalues}`
        
                con.query(valueaddquery,(err,result)=>{ 
                  if(err) throw (err)
                  else
                  {
                    res.json({"success":"Attribute added successfully"})
                  }
                })
            }
            else
            {
              res.json({"success":"Attribute added successfully"})
            }
          }
        })
      }
    })
    
  }
  

  else

  {
              //if operation value not null then it will be edit.query for update  product attribute column name if attribute name change.here always update 
               
                    // update catgeoryattribute value table  attributename using attribute id
                    updatecategoryvalueattribute=`UPDATE categoryattribute SET attributeName= '${req.body.attributeName}' WHERE attributeId=${req.body. operationid} `
                    con.query(updatecategoryvalueattribute,(err,result)=>{
                      if(err) throw (err)
                      else
                      {
                        //update attribute table using data
                        attributeUpdate=`UPDATE attribute SET attributeName='${req.body.attributeName}', status= '${req.body.status}' WHERE id=${req.body.operationid}`
                        con.query(attributeUpdate,(err,result)=>{
                          if(err) throw (err);
                          else {
                           
                            if(JSON.parse(req.body.attributevalues).length!=0)
                            {
                            let attributevalues=JSON.parse(req.body.attributevalues)
                            //select all attribute values using attribute id
                             getattribute=`select * from attributevalue WHERE attributeId=${req.body.operationid}`
                             con.query(getattribute,(err,result3)=>{
                               if(err) throw (err)
                               else
                               {
                                console.log("fdd")
                                // map the database attribute value and check frontend posted attribute value conatin or not.if not contain false then delete else insert
                                 Object.values(result3).map((item,key)=>{
                                    if(attributevalues.includes(item.value)==false)
                                    {
                                      /*delete if value not contain .now diable beacuse if it is delete it effect products.waiting for getting alternative solution*/
                                      // deletequery=`delete from attributevalue where id='${item.id}' `
                                      // con.query(deletequery,(err,result)=>{
                                      //   if(err ) throw (err)
                                      // })
                                    }
                                 })
                                 attributevalues.map((item,key)=>{
                                  insertValueQuery=`insert into attributevalue (attributeid,value) SELECT '${req.body.operationid}', '${item}' WHERE 0 = (SELECT COUNT(*) from attributevalue where value='${item}' and attributeid=${req.body.operationid} )`
                                   console.log(insertValueQuery)        
                                  con.query(insertValueQuery,(err,result)=>{ 
                                                  if(err) throw (err)
                                                  else
                                                  {
                                                    if(attributevalues.length==key+1)
                                                    res.json({"success":"Attribute updated successfully"})
                                                  }
                                                })
                                 })
                                
                               }
                             })
                                
                            }
                            else
                            {
                              res.json({"success":"Attribute updated successfully"})
                            }
                          }
                        
                        }) 
                      }
                    })       
                             
  }
})
       
              
 


//get attribute for showing in page table
router.get('/attribute/getData',validateToken,function(req,res){

 let itemmodel=[];
   getatt=` select * from attribute where attributeName LIKE '%${req.query.search}%' ORDER BY id DESC LIMIT ${ (+req.query.PageNo-1) * 10}, 13`
   con.query(getatt,(err,result)=>{
     if(err) throw (err)
     else
     {
      
       result.map((item,key)=>{
         getattvalues=`select value from attributevalue where attributeid=${item.id}`
         con.query(getattvalues,(err1,result1)=>{
           if(err1) throw (err1)
           else
             setattribute(item,result1,result.length,req.query.search)
         })
       })
     }
   })


    function setattribute(attribute,attributevalues,length,searchVal)
    {
     
      let attirbuteval=[];

      attributevalues.map((item,key)=>{
        attirbuteval.push(item.value)
      })
     
      
      
       itemmodel.push({id:attribute.id,attributeName:attribute.attributeName,status:attribute.status ,values:attirbuteval})
       if(itemmodel.length==length)
       {
        TotalCount=`select COUNT(*) as count from attribute WHERE attributeName LIKE '%${searchVal}%'`
        con.query(TotalCount,(err1,result1)=>{
          if(err1) throw (err1)
          else
          {
            let tablehead=['SlNo','attributeName','status','values']
            res.json({ "Data":itemmodel,"TableHead":tablehead ,Count:result1[0].count})
          }
        })
       
       
       }
      
      
    }


 
  
})

// router.get('/editattribute', (req,res)=>{

//   attributevaluefetch=`select * from attributevalue where id="${req.query.attributeid}"`
//   con.query(attributevaluefetch,(err,result)=>{
//     if(err) throw (err)
//     else
//     res.send()
//   })
// })

module.exports=router 

