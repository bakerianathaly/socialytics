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
// Función para el Login del usuario
async function loggedIn(req,res,done){
    // variable para almacenar las credenciales introducidas por el usuario.
    var cred = req.body
    // variable para almacenar el usuario que esta almacenado en la BD.
    var user = await userModel.findOne({email:cred.email}).exec()
    // valida si hay campos vacios.
    if(cred.email == "" || cred.password == "" ){
        
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }

    else{
        
        try{
            // verifica si el usuario esta registrado, de lo contrario muestra el mensaje de clave o mensaje incorrecto.
            if(!user){
                res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"The e-mail or password you entered is incorrect"
                }) 
            }
           
            const enteredPassword=cred.password
            // compara si la clave ingresada es igual a la almacenada en la BD.
            if((enteredPassword == user.password)){
                
                // expiración del token generado en 24 Hrs. 
                const expiresIn= 24*60*60 
                // genera el token , pasando el id del usuario, a secret key y el tiempo de expiración.
                const accessToken=jwt.sign({id:user.id},SECRET_KEY,{expiresIn:expiresIn})
                // JSON para enviar los datos del usuario y los detalles del token al Front.
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