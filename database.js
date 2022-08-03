// var mysql=require("mysql")
// var con=mysql.createConnection({
    // host:"localhost",
    // user:"root",
    // password:"",
    // database:"mobilehouse"

// })
// con.connect((err)=>{
//     if(err) throw err
//      console.log("database connected")
// })
// module.exports=con;

// var mysql=require("mysql")

// const pool = mysql.createPool({
//      host     : 'localhost',
//     user     : 'Fahadpj',
//     password : 'Fajar@159',
//     database : 'checkdatamobtest'
// });


// pool.query('select 1 + 1', (err, rows) => { "database connected" });
// module.exports=pool;
var mysql=require("mysql")

const pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"mobilehouse"
});


pool.query('select 1 + 1', (err, rows) => { "database connected" });
module.exports=pool;