var mysql=require("mysql")
var con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"products"

})
con.connect((err)=>{
    if(err) throw err
     console.log("database connected")
})
module.exports=con;