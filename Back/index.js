const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user')
const instagramRoutes = require('./routes/instagram')
const predictionRoutes = require('./routes/prediction')

//Mongo DB connection
if (process.env.NODE_ENV !== "test"){
    //The if means, if the enviroment isn't test then connect to the "production" DB
    mongoose.connect('mongodb://localhost/socialytics', {useNewUrlParser: true, useUnifiedTopology: true , useCreateIndex: true})
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
instagramRoutes(app)
predictionRoutes(app)

https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
}, app).listen(3000, () =>{
    console.log("App corriendo en https://localhost:3000");
});

// app.listen(3000, () => {
//     console.log('App corriendo en https://localhost:3000')
// })

module.exports = app