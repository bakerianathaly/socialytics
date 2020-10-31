//Models 
const userModel = require('../models/user')

async function register(req,res,done) {
    var data = req.body
    
    if(data.name == "" || data.lastName == "" || data.password == "" || data.email == "" || data.industry == ""){
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else if(data.password.length < 8 || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3,4})+$/.test(data.email) != true){
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field has to be filled in the required format"
        })
    }
    else{
        try{
            var newUser = new userModel(data)
            var register = await newUser.save()
            res.status(200).send({
                status: "200",
                response:"OK",
                message: "Register successful"
            })
        }catch(err){
            res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "The register has fail due to an error"
            })
        }
    }
}

async function get(req,res,done){
    done()
}
    
module.exports = {
    register,
    get
}