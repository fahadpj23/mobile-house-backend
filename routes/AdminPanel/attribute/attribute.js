const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator');
const { disable } = require('express/lib/application');

router.post('/attrubuteAdd',
[
  check('name').notEmpty(),
  check('status').notEmpty(),
],
parseUrlencoded,function(req,res)
{
  const{name,status}=req.body
  const error=validationResult(req);
  if(!error.isEmpty)
    return res.json({error:error.array})
  else
  {
    searchqr=`select Count(*) as  count from attribute where attributeName='${req.body.name}'`

    con.query(searchqr,(err,result)=>{
      if(result[0].count>0)
      {
        res.json({"error":"attribute already exist"})
      }
      else
      {
        columninsert=`Alter table productattribute add ${req.body.name} varchar(255)`
        con.query(columninsert,(err,result,fields)=>
        {
        
        if(err) throw(err);
        })
        addattribute=`insert into attribute (attributeName,status) values ('${req.body.name}','${req.body.status=="active" ? 1 : 0}')`
        console.log(addattribute)
        con.query(addattribute,(err,result)=>{
          if(err) throw (err);
          else {
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
                valueaddquery=`insert into attributevalue (attributeid,value) values ${insertvalues}`
        
                con.query(valueaddquery,(err,result)=>{ 
                  if(err) throw (err)
                  else
                  {
                    res.json({"success":"Attribute added successfully"})
                  }
                })
            }
          }
        })
      }
    })
    
  }
 
})

router.get('/getattribute',function(req,res){
   var attribute;
  var responsemodel;
  let itemmodel=[];
    getatt='select * from attribute'
    con.query(getatt,(err,result)=>{
      if(err) throw (err)
      else
      {
        result.map((item,key)=>{
          getattvalues=`select value from attributevalue where attributeid=${item.id}`
          con.query(getattvalues,(err1,result1)=>{
            if(err1) throw (err1)
            else
              setattribute(item,result1,result.length)
          })
        })
      }
    })

    function setattribute(attribute,attributevalues,length)
    {
     console.log(length)
      let attirbuteval=[];

      attributevalues.map((item,key)=>{
        attirbuteval.push(item.value)
      })
     
      
      
       itemmodel.push({id:attribute.id,attributeName:attribute.attributeName,status:attribute.status==1 ?"active" : "disable" ,values:attirbuteval})
       if(itemmodel.length==length)
       {
         res.send(itemmodel )
       }
      
      
    }

  console.log(itemmodel)
 
  
})

module.exports=router 

