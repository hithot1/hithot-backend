//apiRouter.js
  
const express =require('express');
// const apiRouter = express.Router();
 
 const mysql = require('mysql');
  
const pool = mysql.createPool({
    connectionLimit: 10,    
    password: process.env.MYSQL_PWD,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    host: process.env.MYSQL_HOST,
  
}); 

UserDetailByEmail = (email) =>{
    return new Promise((resolve, reject)=>{
        console.log("select * from admin where email='"+email+"' ")
        pool.query("select * from admin where email='"+email+"' ",  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(JSON.parse(JSON.stringify(elements)));
        });
    });
};

const customerFunctions = {
    findByEmail: async function(email, cb) {
        
        // apiRouter.get('/', async (req, res, next)=>{
            try {
                if(email)
                {
                    let rd=await UserDetailByEmail(email); 
                                      
                  //  console.log("output",rd[0])
                    return cb(rd);
                    //return output;
                  //  res.status(200).json(output);
                }
                else
                {
                    let output={
                        code:"201",
                        msg:{
                            response:"Json Parem are missing 1"
                        }
                    }
                    return cb(output);
                    //res.status(200).json(output);
                   
                }
            // send a json response
            } catch(e) {
                let output={
                    code:"201",
                    msg:{
                        response:"Error"
                    }
                }
                return cb(output);
               // res.status(200).json(output);
            }
        // });
    }
}
module.exports = customerFunctions;