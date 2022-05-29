const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../../database');
const validateToken=require("../../../middlewares/authmiddelware");
const { parse } = require('express-form-data');
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  


router.post("/productAdd",parseUrlencoded,function(req,res){


  const productimage=(file,dbid,imgposition)=>{
  
    imageIsOrNotInDb=`select COUNT(*) as count from productimage where productId='${dbid}' and imageposition='${imgposition}'`
   
    con.query(imageIsOrNotInDb,(err,result)=>{
      if(err) throw (err)
      else
      {
       
       if(result[0].count==0)
       {
        file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
        imageaddqr=`insert into productimage (productId,imagePosition,image) values (${dbid},'${imgposition}','${Math.round(new Date().getTime()/1000)}${file.name}')`
       
        con.query(imageaddqr,(err,result)=>{
          if(err)throw (err)
        })
       }
       else
       {
        file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
        updateImage=`UPDATE  productimage set image='${Math.round(new Date().getTime()/1000)}${file.name}' where imagePosition='${imgposition}' and productId=${dbid}`
        console.log(updateImage)
        con.query(updateImage,(err,result)=>{
          if(err)throw (err)
        })
       }
      }
    })
   
  }
  let product=req.body
  let imageblob=JSON.parse(req.body.productImageblob)
 

  
  if(req.body.operation=="" || req.body.operation=="variant" )
  { 
 

           
            addqr=`insert into products (  name,  purchasePrice,sellingPrice,salesPrice, mrp ,warranty,  Brand,qty ,HSN,Tax,category,variantid) values ('${product.Name}','${product.purchasePrice}','${product.sellingPrice}','${product.salesPrice}','${product.MRP}','${product.Warranty}','${product.Brand}','${product.qty}','${product.HSN}','${product.Tax}','${product.categoryid}','${product.operationid}')`;
          
            let columnarray=[]
            let columnvalue=[]

         

            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else 
            {
             
              
              for(let i=1;i<=5;i++)
              {
                if(imageblob[i-1])
                {
                
                  let image=req.files["image"+(i)] 
                  console.log(image)
                  image && productimage(image,result.insertId,i )
                }
                
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
                variantupdate=`UPDATE products SET variantid="${product.operationid}" WHERE id="${result.insertId}" ` 
                con.query(variantupdate,(err1,result1)=>
                {
                  if(err1) throw (err1)
                })
                
              }
            
              //select catgeory attribute and add priduct attribute to that catgeory attribute
              categoryattribute=`select *  from categoryattribute where  categoryId="${product.categoryid}"`
              console.log(categoryattribute)
              con.query(categoryattribute,(err,result1)=>{
                if(err) throw (err)
                else
                {
                  Object.values(result1).map((item,key)=>{
                    console.log(product[item.attributeId])
                    insertproductattributequery=`insert into productattribute (productid,attributeId,attributeValueId) values (${result.insertId},${item.attributeId},${product[item.attributeId]})`
                    con.query(insertproductattributequery,(err,result)=>{
                      if(err) throw (err)
                      else
                      if(Object.values(result1).length==key+1)
                        res.json({"success":"success"})
                    })
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
 
      addqr=`UPDATE products SET  name='${product.Name}' , purchasePrice='${product.purchasePrice}',sellingPrice='${product.sellingPrice}',salesPrice='${product.salesPrice}', mrp='${product.MRP}' ,warranty='${product.Warranty}',  Brand='${product.Brand}',qty='${product.qty}',HSN='${product.HSN}' ,Tax='${product.Tax}',category='${product.categoryid}' where id='${product.operationid}'`;
 
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else 
    {
    
    
      for(let i=1;i<=5;i++)
      {
        // console.log("dsdsdsd")
        // console.log(imageblob[i])
        // console.log(i)
        // console.log("image"+(i))
        // console.log(req.files.image2 )
        // console.log("sfgdfgh")
       
        if(imageblob[i-1])
        {
        
          let image=req.files["image"+(i)] 
          console.log(image)
          image && productimage(image,product.operationid,i )
        }
        
      }
      categoryattribute=`select *  from categoryattribute where  categoryId="${product.categoryid}"`
      console.log(categoryattribute)
      con.query(categoryattribute,(err,result1)=>{
        if(err) throw (err)
        else
        {
          Object.values(result1).map((item,key)=>{
            console.log(product[item.attributeId])
            insertproductattributequery=`UPDATE productattribute SET attributeValueId=${product[item.attributeId]} where productid=${product.operationid} and attributeId=${item.attributeId}`
            con.query(insertproductattributequery,(err,result)=>{
              if(err) throw (err)
              else
              if(Object.values(result1).length==key+1)
                res.json({"success":"success"})
            })
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

  // getProduct=`select * from products  where id=${req.query.productId} innerjoin  productimage where id=${req.query.productId} `
  getProduct=` SELECT *,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productId = ${req.query.productId}) as image from products where id=${req.query.productId}`
    con.query(getProduct,(err,result)=>{
       if(err) throw (err)
       else
      {
        getProduct=`select * from productattribute  where productid=${req.query.productId}`
        
        con.query(getProduct,(err1,result1)=>{
           if(err) throw (err)
           else
          {
           
           Object.values(result1).map((item,key)=>{
            //  console.log([item[1].attributeId])
            //  console.log([item[1].attributeValueId])
           
          
               result[0][item.attributeId]=item.attributeValueId
               console.log(result)
          //   }
              
            
               if(Object.values(result1).length ==  +key+1 )
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