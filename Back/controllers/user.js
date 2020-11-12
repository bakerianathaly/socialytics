//Models 
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const SECRET_KEY="secretkey123456"

async function register(req,res,done) {
    var data = req.body
    var existingUser = await userModel.findOne({ email: data.email}).exec()

    if(existingUser != null){
        res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"Email is invalid or already taken"
        }) 
    }
    else if(data.name == "" || data.lastName == "" || data.password == "" || data.email == "" || data.industry == ""){
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else if(data.password.length < 8 || /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
            .test(data.email) != true){
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
                message: "Sign up successful"
            })
        }catch(err){
            res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "The sign up has failed due to an error"
            })
        }
    }
}

async function get(req,res,done){
    done()
}
// User's login function.
async function loggedIn(req,res,done){
    // User's entered values variable.
    var cred = req.body
    // It checks if there're any users stored in the database.
    var user = await userModel.findOne({email:cred.email}).exec()
    // It checks for any empty fields in the form.
    if(cred.email == "" || cred.password == "" ){
        
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }

    else{
        
        try{
            // if the user doesn't exist, send an error message.
            if(!user){
                res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"The e-mail or password you entered is incorrect"
                }) 
            }
           
            const enteredPassword=cred.password
            // this checks if the user's entered password matches with the one stored in the database.
            if((enteredPassword == user.password)){
                
                // this assigns an expiration time for the token in 24 hours. 
                const expiresIn= 24*60*60 
                // this generates the user's token by expiration, secretkey and Id.
                const accessToken=jwt.sign({id:user.id},SECRET_KEY,{expiresIn:expiresIn})
                // User's JSON data to send to the front. This includes the token and its expiration time.
                let datos= {
                    id:user.id,
                    name: user.name,
                    email: user.email,
                    accessToken:accessToken,
                    expiresIn:expiresIn
                }
               
                res.status(200).send({
                    datos,
                    status: "200",
                    response:"OK",
                    message: "Login Successful" 
                })
            
            }
            else{
                res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"The e-mail or password you entered is incorrect"
                })   
            }
        
        }catch(err){
            res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "login failed due to an error"
            })
        }
    }


}
    
module.exports = {
    register,
    loggedIn,
    get
}