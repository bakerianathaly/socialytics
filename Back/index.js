const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user')

//Mongo DB connection
if (process.env.NODE_ENV !== "test"){
    //The if means, if the enviroment isn't test then connect to the "production" DB
    mongoose.connect('mongodb://localhost/socialytics', {useNewUrlParser: true})
    mongoose.connection.once("open", () =>{
        console.log("Connected to DB")
    }).on("error", err =>{
        console.warn("Error ", err)
    })
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes, they need the app object
userRoutes(app)

app.listen(3000, () => {
    console.log('App corriendo en http://localhost:3000')
})

module.exports = app