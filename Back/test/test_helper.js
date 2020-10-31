var mongoose = require('mongoose');

before(done => {
    mongoose.connect('mongodb://localhost/socialyticsTest',{useNewUrlParser: true});
    mongoose.connection.once("open", () =>{
        console.log("Connected to DB test")
        done()
    }).on("error", err =>{
        console.warn("Error at the DB test", err)
    })
})