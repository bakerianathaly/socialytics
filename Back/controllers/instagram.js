//Models
const instagramModel = require('../models/instagram')

async function accountRegister(req,res,done){
    var data = req.body
    console.log('estoy en la funcion', data)
    try{
        var newUser = new instagramModel(data)
        var register = await newUser.save()
        res.status(200).send({
            status: "200",
            response:"OK",
            message: "Account added successfully"
        })
    }catch(err){
        console.log(err)
        res.status(404).send({
            status: "404",
            response:"Not Found",
            message: "The sign up has fail due to an error"
        })
    }
}

async function get(req,res,done){
    console.log(req.body)
    var existingUser =  await instagramModel.findOne({ socialyticId: req.body.id}).exec()
    console.log(existingUser)
    res.status(200).send({
        status: "200",
        response:"OK",
        message: "Account added successfully",
        user: existingUser
    })
}

module.exports = {
    accountRegister,
    get
}