const controller={};
const con=require('../database')


controller.get =(req,res)=>{
    let Tablehead=[];
    getsupplierquery=`select * from supplier `
    con.query(getsupplierquery,(err,result)=>{
        if(err) throw (err)
        else
        {
            Object.entries(result[0]).map((item,key)=>{
                Tablehead.push(item[0])
            })
            res.json({ "Data":result,"TableHead":Tablehead })
       

        }
    })
}
controller.post=(req,res)=>{
    const supplier=req.body
    if(supplier.operation=="")
    {
        supplieraddquery=`insert into supplier (supplierName,phone,address,pincode,status)Values ('${supplier.supplierName}','${supplier.phone}','${supplier.address}','${supplier.pincode}','${supplier.status}')`
        console.log(supplieraddquery)
        con.query(supplieraddquery,(err,result)=>{
            if(err) throw (err)
            else
            {
                res.json({success:"supplier added successfully"})
            }
        })
    }
    else
    {
        suppliereditquery=`update supplier set supplierName='${supplier.supplierName}',phone='${supplier.phone}',address='${supplier.address}',pincode='${supplier.pincode}',status='${supplier.status}' where id='${supplier.operationid}'`
        console.log(suppliereditquery)
        con.query(suppliereditquery,(err,result)=>{
            if(err) throw (err)
            else
            {
                res.json({success:"supplier edited successfully"})
            }
        }) 
    }
}

module.exports=controller;