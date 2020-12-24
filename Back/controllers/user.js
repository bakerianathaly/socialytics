//Models 
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')
const SECRET_KEY="secretkey123456"

async function register(req,res,done) {
    var data = req.body
    var existingUser = await userModel.findOne({ email: data.email}).exec()

    if(existingUser != null){
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"Email is invalid or already taken"
        }) 
    }
    else if(data.name == "" || data.lastName == "" || data.password == "" || data.email == "" || data.industry == ""){
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else if(data.password.length < 8 || /^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
            .test(data.email) != true){
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field has to be filled in the required format"
        })
    }
    else{
        try{
            var newUser = new userModel(data)
            var register = await newUser.save()
            return res.status(200).send({
                status: "200",
                response:"OK",
                message: "Sign up successful",
                id: register._id
            })
        }catch(err){
            return res.status(404).send({
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
        
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }

    else{
        
        try{
            // if the user doesn't exist, send an error message.
            if(!user){
                return res.status(409).send({
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
                    lastName: user.lastName,
                    email: user.email,
                    password:user.password,
                    industry:user.industry,
                    accessToken:accessToken,
                    expiresIn:expiresIn
                }
               
                return res.status(200).send({
                    datos,
                    status: "200",
                    response:"OK",
                    message: "Login Successful" 
                })
            
            }
            else{
                return res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"The e-mail or password you entered is incorrect"
                })   
            }
        
        }catch(err){
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "Login failed due to an error"
            })
        }
    }
}
// Function to update user's data from the app
async function UpdateUser(req,res,done){
    
    var data=req.body
    // variable for the user's id.
    var id=data.id
    
    if(data.name == "" || data.lastName == "" || data.email == "" || data.industry == ""){
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Empty fields are not allowed"
        })
    }
    
    // it validates if the email is on the right format.
    else if (/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i
    .test(data.email) != true){

        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This Email is on the wrong format, please try again"
        })

    }
    else{
        try{
            
            if (data.password.length < 8 ) {
                return res.status(406).send({
                    status: "406",
                    response:"Conflict",
                    message:"This password is on the wrong format, please try again"
                })

            }
            else{
                userModel.findByIdAndUpdate(id,data,{upsert:true},function(err, doc) {
                    console.log(err)
                    
                    if (err) {
                       return res.send(500, {error: err});
                       
                    }
                    return res.status(200).send({
                        status: "200",
                        response:"OK",
                        message: "The update has been successful",
                    })
                })
            }
        }catch(err){
        
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "Update has failed due to an error"
            })
        }
    }
}
    
module.exports = {
    register,
    loggedIn,
    UpdateUser,
    get
}