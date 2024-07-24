require("dotenv").config();
const express = require("express");
// const morgan = require('morgan');
const db = require('./db')
const app = express();
const cors = require("cors");
app.use(cors());
// app.use(morgan())

app.use(express.json());
//get all restaurants 
app.get("/api/v1/restaurants", async (req, res)  => {
    try {
        const results = await db.query("select * from restaurants");
        console.log(results)
        res.status(200).json({
            status: "success",
            results: results.rows.length, 
            data: {
                restaurants: results.rows,
            },
        }); 
    } catch(err) {
        console.log(err)
    }
    
});

//http://localhost:3001/getRestaurants

//get individual restaurants 
app.get("/api/v1/restaurants/:id", async (req, res) =>{
    console.log(req.params.id);
    try {
       const results = await db.query(
        "select * from restaurants where id = $1" , [req.params.id]
       );
       console.log(results.rows[0]);
       res.status(200).json({
        status:"sucess",
        date: {
            restaurants: results.rows[0],
        },
      });
    }catch(err){
       console.log(err);
    };
    
   
});


//create a restaurant
app.post("/api/v1/restaurants", async (req, res) =>{
    console.log(req.body)
    try {
        const results = await db.query(" INSERT INTO restaurants (name , location, price_range) values ($1, $2, $3) returning *", [req.body.name , req.body.location, req.body. price_range]);
        console.log(results)
        res.status(201).json({
            status:"sucess",
            date: {
                restaurants: results.rows[0],
            },
          });
    }catch(err){
        console.log(err)

    }
    
   
}); 

//update restaurants

app.put("/api/v1/restaurants/:id", async (req, res) => {
    try{
        const results = await db.query( 
            "UPDATE restaurants SET name = $1, location = $2, price_range = $3 where id = $4 returning *" , [req.body.name, req.body.location, req.body.price_range, req.params.id]);
        console.log(results)
        res.status(200).json({
            status:"sucess",
            date: {
                restaurants: results.rows[0],
            },
          });

    }catch(err){

    }
     console.log(req.params.id);
     console.log(req.body);
     
});

// Delete Restaurants 
app.delete("/api/v1/restaurants/:id", async (req, res) =>{
    try{
        const results = await db.query("DELETE FROM restaurants where id = $1", [req.params.id]);
        res.status(204).json({
        status:"sucess"
      });
    }catch(err){
        console.log(err)
    }
     
});


const hostname = process.env.HOSTNAME
const port = process.env.PORT || 3001;
app.listen(1000, () => {
    console.log(`server is up and listening on port ${port}`)
;});