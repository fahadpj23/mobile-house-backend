const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../../database');
const { func } = require('react-globally');
const { Result } = require('express-validator');
const { commit } = require('../../../database');
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  


router.post("/productAdd",parseUrlencoded,function(req,res){
  let product=req.body
 
  if(req.body.operation=="" || req.body.operation=="variant" )
  { 
 
           
            if(req.files)
            {
            const file=req.files.image
            file.mv(`products/images/${file.name}`)
            addqr=`insert into products (  name,  price, mrp ,warranty, image, Brand,qty ,category) values ('${product.Name}','${product.Price}','${product.MRP}','${product.Warranty}','${file.name}','${product.Brand}','${product.qty}','${product.category}')`;
            }
            else
            {
             
              addqr=`insert into products (  name,  price, mrp ,warranty, image, Brand,qty ,category) values ('${product.Name}','${product.Price}','${product.MRP}','${product.Warranty}','${product.variantimage}','${product.Brand}','${product.qty}','${product.category}')`;
         
            }
            let columnarray=[]
            let columnvalue=[]

         

            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else 
            {
            
              // addqr=`insert into products (  name,  price, mrp ,warranty, image, Brand,qty ,category) values ('${product.Name}','${product.Price}','${product.MRP}','${product.Warranty}','${file.name}','${product.Brand}','${product.qty}','${product.category}')`;
              // columnfetch=`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = "${product.category}";`
              categoryattribute=`select * from categoryattribute where  categoryId="${product.categoryid}"`
              con.query(categoryattribute,(err,result1)=>{
                if(err) throw (err)
                else
                {
              
                result1.map((item,key)=>{
                  columnarray.push(item.attributeName)
                  
                    columnvalue.push("'"+product[item.attributeName]+"'")
                
                  
                })
                insertquery=`insert into productattribute (id,${columnarray}) values ('${result.insertId}',${columnvalue})`
               
                con.query(insertquery,(err,result)=>{
                  if(err) throw (err)
                  else
                    res.json({"success":"success"})
                })
                }
              
              })
              
            }
          })
  }
  else
  {
  
    let columnarray=[]
    let columnvalue=[]
    if(req.files)
    {
    const file=req.files.image
    file.mv(`products/images/${file.name}`)
    addqr=`UPDATE products SET  name='${product.Name}' , price='${product.Price}', mrp='${product.MRP}' ,warranty='${product.Warranty}', image='${file.name}', Brand='${product.Brand}',qty='${product.qty}' ,category='${product.category}' where id='${product.operationid}'`;
    }
    else
    {
      addqr=`UPDATE products SET  name='${product.Name}' , price='${product.Price}', mrp='${product.MRP}' ,warranty='${product.Warranty}',  Brand='${product.Brand}',qty='${product.qty}' ,category='${product.category}' where id='${product.operationid}'`;
 
    }
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else 
    {
    
      
      categoryattribute=`select * from categoryattribute where  categoryId="${product.categoryid}"`
      con.query(categoryattribute,(err,result1)=>{
        if(err) throw (err)
        else
        {
      
        result1.map((item,key)=>{
          let updatequ=item.attributeName+ "="+ "'" +product[item.attributeName] + "'"
          columnarray.push(updatequ)
          
           
        
          
        })
        
        insertquery=`UPDATE productattribute SET  ${columnarray.toString()} where id='${product.operationid}'`
       
        con.query(insertquery,(err,result)=>{
          if(err) throw (err)
          else
            res.json({"success":"success"})
        })
        }
      
      })
      
    }
  })
  }
})

router.get('/getcategoryAttribute',function(req,res){
  let attributevaluearray=[]

  categoryAttribute=`select * from categoryattribute where categoryId="${req.query.categoryid}"`
  con.query(categoryAttribute,(err,result)=>{
    if(err) throw (err)
    else
      result.map((item,key)=>{
        attributevalueget=`select * from attributevalue  where attributeid="${item.attributeId}" `
      
        con.query(attributevalueget,(err,result1)=>{
          if(err) throw (err)
          else
          {
            let value={"attributeid" : item.attributeId,"attributeName":item.attributeName,"value":result1}
            attributevaluearray.push(value)
            if(key==result.length-1)
            {
              res.send(attributevaluearray)
            }
          }
        })
      })
  })
 
})

router.get('/getProduct',(req,res)=>{

    getProduct=`select * from products`
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
      {
       let tablehead=['SlNo','name','price','mrp','Brand','category']
       res.json({ "Data":result,"TableHead":tablehead })
      }
    })

})
router.get('/productdetails',(req,res)=>{

  getProduct=`select * from products  where id=${req.query.productId}`
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
      {
        getProduct=`select * from productattribute  where id=${req.query.productId}`
        con.query(getProduct,(err1,result1)=>{
           if(err) throw (err)
           else
          {
           
           Object.entries(result1[0]).map((item,key)=>{
            if(item[1]!=null)
            {
              result[0][item[0]]=item[1]
            }
              
            
               if(Object.entries(result1[0]).length ==  +key+1 )
               {
                 res.send(result[0])
               }
             
            
             
           })
          }
        })
      }
    })
})


module.exports=router;  