//apiRouter.js
  
const express =require('express');
const apiRouter = express.Router();
 
 const mysql = require('mysql');
  
const pool = mysql.createPool({
    connectionLimit: 10,    
    password: '',
    user: 'root',
    database: 'hithot_vidz',
    host: 'localhost',
  
}); 
 
SelectAllElements = () =>{
    return new Promise((resolve, reject)=>{
        pool.query('SELECT * FROM DB_table ',  (error, elements)=>{
            if(error){
                return reject(error);
            }
            return resolve(elements);
        });
    });
};
 
 
apiRouter.get('/', async (req, res, next)=>{
    try {
        const resultElements = await SelectAllElements();
        res.status(200).json({elements: resultElements}); // send a json response
    } catch(e) {
        console.log(e); // console log the error so we can see it in the console
        res.sendStatus(500);
    }
});