const express = require('express');
const bodyParser = require('body-parser');
const request = require("request-promise");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req,res)=>{
    return res.send({aux:"Hola mundo(?"})
})

module.exports = app.listen(3000, () => {
    console.log('App corriendo en http://localhost:3000')
})
