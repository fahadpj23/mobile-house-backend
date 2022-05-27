const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../../database');
const validateToken=require("../../../middlewares/authmiddelware");
const { parse } = require('express-form-data');
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  


router.post("/productAdd",parseUrlencoded,function(req,res){


  const productimage=(file,dbid)=>{
   
    file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
    imageaddqr=`insert into productimage (productId,image) values (${dbid},'${Math.round(new Date().getTime()/1000)}${file.name}')`
    con.query(imageaddqr,(err,result)=>{
      if(err)throw (err)
    })
  }
  let product=req.body
console.log(product)
  if(req.body.operation=="" || req.body.operation=="variant" )
  { 
 
    console.log("dsdsd")
           
            addqr=`insert into products (  name,  purchasePrice,sellingPrice,salesPrice, mrp ,warranty,  Brand,qty ,HSN,Tax,category,variantid) values ('${product.Name}','${product.purchasePrice}','${product.sellingPrice}','${product.salesPrice}','${product.MRP}','${product.Warranty}','${product.Brand}','${product.qty}','${product.HSN}','${product.Tax}','${product.categoryid}','${product.operationid}')`;
          
            let columnarray=[]
            let columnvalue=[]

         

            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else 
            {
              let images=JSON.parse(product.productImage)
              for(let i=0;i<=5;i++)
              {
                let image=req.files["image"+(i)]
                console.log(image)
               image && productimage(image,result.insertId)
              }
              
             
              if(product.operationid=="")
              {
               
                variantupdate=`UPDATE products SET variantid="${result.insertId}" WHERE id="${result.insertId}" ` 
                con.query(variantupdate,(err1,result1)=>
                {
                  if(err1) throw (err1)
                })

              }
              else
              {
                variantupdate=`UPDATE products SET variantid="${operationid}" WHERE id="${result.insertId}" ` 
                con.query(variantupdate,(err1,result1)=>
                {
                  if(err1) throw (err1)
                })
                
              }
            
              //select catgeory attribute and add priduct attribute to that catgeory attribute
              categoryattribute=`select * from categoryattribute where  categoryId="${product.categoryid}"`
              con.query(categoryattribute,(err,result1)=>{
                if(err) throw (err)
                else
                {
              
                result1.map((item,key)=>{
                  columnarray.push(item.attributeName)
                  
                    columnvalue.push(""+product[item.attributeName]+"")
                
                  
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
    console.log(product)
    let columnarray=[]
    let columnvalue=[]
    if(req.files)
    {
    const file=req.files.image
    file.mv(`products/images/${file.name}`)
    addqr=`UPDATE products SET  name='${product.Name}' , purchasePrice='${product.purchasePrice}',sellingPrice='${product.sellingPrice}',salesPrice='${product.salesPrice}', mrp='${product.MRP}' ,warranty='${product.Warranty}', image='${file.name}', Brand='${product.Brand}',qty='${product.qty}',HSN='${product.HSN}' ,Tax='${product.Tax}',category='${product.categoryid}' where id='${product.operationid}'`;
    }
    else
    {
      addqr=`UPDATE products SET  name='${product.Name}' , purchasePrice='${product.purchasePrice}',sellingPrice='${product.sellingPrice}',salesPrice='${product.salesPrice}', mrp='${product.MRP}' ,warranty='${product.Warranty}',  Brand='${product.Brand}',qty='${product.qty}',HSN='${product.HSN}' ,Tax='${product.Tax}',category='${product.categoryid}' where id='${product.operationid}'`;
 
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

    getProduct=`select id,name,purchasePrice,sellingPrice,salesPrice,mrp,Brand,category,(SELECT categoryName FROM category WHERE category.id=products.category ) As categoryName from products`
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
      {
       let tablehead=['SlNo','name','purchasePrice','sellingPrice','salesPrice','mrp','Brand','categoryName']
       res.json({ "Data":result,"TableHead":tablehead })
      }
    })

})
router.get('/productdetails',(req,res)=>{

  getProduct=`select * from products  where id=${req.query.productId} innerjoin  productimage where id=${req.query.productId} `
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