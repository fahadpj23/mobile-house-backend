const express=require('express')
const router = express.Router()
const con=require("../../../database")
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  
const {check,validationResult}=require('express-validator')

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

module.exports=router 

