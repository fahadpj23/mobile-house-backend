const express=require('express')
var bodyParser=require("body-parser");
var jsonParser=bodyParser.json();
const router = express.Router()
const con=require('../../../database');
const validateToken=require("../../../middlewares/authmiddelware");
var parseUrlencoded = bodyParser.urlencoded({ extended: true });  






router.delete("/productDelete",validateToken,function(req,res){

  productdelete=`delete products, productattribute, productimage from products LEFT join productattribute on products.id = productattribute.productid LEFT join productimage on products.id = productimage.productId WHERE products.id = ${req.query.productId}`

  con.query(productdelete,(err,result)=>{
    if(err)throw (err)
    else
    {
      
      res.json({success:"product deleted successfully"})
    }

  })
})


router.post("/productAdd",validateToken,parseUrlencoded,function(req,res){


  
  let product=req.body

  let imageblob=JSON.parse(req.body.productImageblob)
  let productImages=JSON.parse(req.body.productImage)


  
  if(req.body.operation=="" || req.body.operation=="variant" )
  { 
        

           
            addqr=`insert into products (name,  purchasePrice,sellingPrice,salesPrice, mrp ,warranty,  Brand,qty ,HSN_Code,Tax,category,Description,variantid) values ('${product.Name}','${product.purchasePrice}','${product.sellingPrice}','${product.salesPrice}','${product.MRP}','${product.Warranty}','${product.Brand}','${product.qty}','${product.HSN_Code}','${product.Tax}','${product.categoryid}','${product.Description}','${product.operationid}')`;
          
          
         
         

            con.query(addqr,(err,result)=>{

              if(err) throw (err);
            else 
            {
             
              
              for(let i=1;i<=5;i++)
              {
                //if image blob is there then add image
                if(imageblob[i-1] && productImages[i-1]!="deleted" )
                {
                   
                  let image=req.files["image"+(i)] 
    
                  image && productimage(image,result.insertId,i )
                }
                
                
              }
              
        
              if( product.variantid=="")
              {
           
                variantupdate=`UPDATE products SET variantid="${result.insertId}" WHERE id="${result.insertId}" ` 
               
                con.query(variantupdate,(err1,result1)=>
                {
                  if(err1) throw (err1)
                })

              }
              else
              {

                variantupdate=`UPDATE products SET variantid="${product.variantid}" WHERE id="${result.insertId}" ` 
                
                con.query(variantupdate,(err1,result1)=>
                {
                  if(err1) throw (err1)
                })
                
              }
            
              //select catgeory attribute and add priduct attribute to that catgeory attribute
              categoryattribute=`select *  from categoryattribute where  categoryId="${product.categoryid}"`
             
              con.query(categoryattribute,(err,result1)=>{
                if(err) throw (err)
                else
                {
            
                  Object.values(result1).map((item,key)=>{
                    if(product[item.attributeId]!="--select--" && product[item.attributeId]!=undefined)
                    {
                    insertproductattributequery=`insert into productattribute (productid,attributeId,attributeValueId) values (${result.insertId},${item.attributeId},${product[item.attributeId]})`
                    con.query(insertproductattributequery,(err,result)=>{
                      if(err) throw (err)
                      else
                      if(Object.values(result1).length==key+1)
                        res.json({"success":"success"})
                    })
                    }
                    else
                    {
                      if(Object.values(result1).length==key+1)
                        res.json({"success":"success"})
                    }
                  })
                  
                }
              
              })
              
            }
          })
  }
  else
  {
  
 
 
      addqr=`UPDATE products SET  name='${product.Name}' , purchasePrice='${product.purchasePrice}',sellingPrice='${product.sellingPrice}',salesPrice='${product.salesPrice}', mrp='${product.MRP}' ,warranty='${product.Warranty}',  Brand='${product.Brand}',qty='${product.qty}',HSN_Code='${product.HSN_Code}' ,Tax='${product.Tax}',category='${product.categoryid}',Description='${product.Description}' where id='${product.operationid}'`;
    
    con.query(addqr,(err,result)=>{

      if(err) throw (err);
    else 
    {
    
    
      for(let i=1;i<=5;i++)
      {
        
        if(productImages[i-1]=="deleted")
        {
            deleteimage=`delete from productimage where productId=${product.operationid} and imagePosition=${i} `
            console.log(deleteimage)
            con.query(deleteimage,(err,result)=>{
              if(err) throw (err)
             

            })
        }
        else
        {
         
          if(imageblob[i-1])
          {
           
            console.log("ddfdfd")
            let image=req.files["image"+(i)] 
            
            image && productimage(image,product.operationid,i )
          }
        }
        
      }
      categoryattribute=`select *  from categoryattribute where  categoryId="${product.categoryid}"`
   
      con.query(categoryattribute,(err,result1)=>{
        if(err) throw (err)
        else
        {
          Object.values(result1).map((item,key)=>{
          
            if(product[item.attributeId]!="--select--" && product[item.attributeId]!=undefined)
            {
            insertproductattributequery=`UPDATE productattribute SET attributeValueId=${product[item.attributeId]} where productid=${product.operationid} and attributeId=${item.attributeId}`
             
            con.query(insertproductattributequery,(err,result)=>{
              if(err) throw (err)
              else
              if(Object.values(result1).length==key+1)
                res.json({"success":"success"})
            })
            }
            else
            {
              if(Object.values(result1).length==key+1)
              res.json({"success":"success"})
            }
          })
          
        }
      
      })
      
    }
  })
  }
  // image addign function
  const  productimage=(file,dbid,imgposition)=>{
   // check image is exist in database using product id and image position
    imageIsOrNotInDb=`select COUNT(*) as count from productimage where productId='${dbid}' and imageposition='${imgposition}'`
    console.log(imageIsOrNotInDb)
    con.query(imageIsOrNotInDb,(err,result)=>{
      if(err) throw (err)
      else
      {
       //if image is not exist
      if(result[0].count==0)
      {
        file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
        // numberOfImage=`select COUNT(*) as imageCount from productimage where productId='${dbid}' '`
        // con.query(numberOfImage,(err1,result1)=>{
        //   if(err1) throw (err1)
        //   else
        //   {
          imageaddqr=`insert into productimage (productId,imagePosition,image) values (${dbid},'${imgposition}','${Math.round(new Date().getTime()/1000)}${file.name}')`
          
        
          con.query(imageaddqr,(err,result)=>{
          if(err)throw (err)
          })
        //   }
        // })
        
      }
      else
      {
        file.mv(`products/images/${Math.round(new Date().getTime()/1000)}${file.name}`)
        updateImage=`UPDATE  productimage set image='${Math.round(new Date().getTime()/1000)}${file.name}' where imagePosition='${imgposition}' and productId=${dbid}`
        // console.log(updateImage)
        con.query(updateImage,(err,result)=>{
          if(err)throw (err)
        })
      }
      }
    })
   
  }
})


//to fetch all attribute value of attribute depends on attribute that connected to category
router.get('/getcategoryAttribute',validateToken,function(req,res){


  let attributevaluearray=[]

  categoryAttribute=`select * from categoryattribute where categoryId="${req.query.categoryid}"`
  con.query(categoryAttribute,(err,result)=>{
    if(err) throw (err)
    else
     if(result.length!=0)
     {
      result.map((item,key)=>{
        attributevalueget=`select * from attributevalue  where attributeid="${item.attributeId}" `
      
        con.query(attributevalueget,(err,result1)=>{
          if(err) throw (err)
          else
          {
            let value={"attributeid" : item.attributeId,"attributeName":item.attributeName,"value":result1}
            
            attributevaluearray.push(value)
            if(key==result.length-1 )
            {
              setTimeout(() => {
                res.send(attributevaluearray)
              }, 200);
            
              
            }
          }
        })
      
      })
     
     }
     else
     {
      res.send("NoAttribute")
     }
  })
 
})

async function categoryvalueset(attributevaluearray,attributeId,attributeName,result1)
{

}

router.get('/getProduct',validateToken,(req,res)=>{

    getProduct=`select id,name,purchasePrice,sellingPrice,salesPrice,mrp,Brand,category,(SELECT categoryName FROM category WHERE category.id=products.category ) As categoryName,(SELECT image from productimage where productimage.productId=products.id LIMIT 1)as image from products ORDER BY products.id DESC`
    con.query(getProduct,(err,result)=>{
      if(err) throw (err)
      else
      {
      let tablehead=['SlNo','name','purchasePrice','sellingPrice','salesPrice','mrp','Brand','categoryName','image']
      res.json({ "Data":result,"TableHead":tablehead })
      }
    })

})


router.get('/productdetails',validateToken,(req,res)=>{

  
  getProduct=` SELECT *,(SELECT group_concat(concat_ws(',', image) separator '; ') FROM productimage WHERE productId = ${req.query.productId}) as image,(SELECT group_concat(concat_ws(',', imageposition) separator '; ') from productimage where productId=${req.query.productId}) as imagepositions from products where id=${req.query.productId}`
  console.log(getProduct)  
  con.query(getProduct,(err,result)=>{
      if(err) throw (err)
      else
      {
        getProduct=`select * from productattribute  where productid=${req.query.productId}`
       
        con.query(getProduct,(err1,result1)=>{
          if(err) throw (err)
          else
          {
           
           if(result1.length)
           {
            Object.values(result1) && Object.values(result1).map((item,key)=>{
           
              result[0][item.attributeId]=item.attributeValueId
                   
              if(Object.values(result1).length ==  +key+1 )
              {
                res.send(result[0])
              }
            
              })
           }
           else
           {
            res.send(result[0])
           }
             
            
             
           
          }
        })
      }
    })
})


module.exports=router;  