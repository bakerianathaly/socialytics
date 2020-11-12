//Models
const instagramModel = require('../models/instagram')
const request = require("request-promise")

async function instagramBasicData(username){
    var instagramData = null 
    var code 
    let peticion = {
        method: "GET",
        uri: `https://www.instagram.com/${username}/?__a=1`,
        resolveWithFullResponse: true,
        json: true
    };
    
   await request(peticion).then((response) => {
        instagramData = response.body.graphql.user        
    }).catch(function (err) {
        code = err        
    })

    if (instagramData != null ){
        return instagramData
    }
    else{
        return code
    }
}

async function instagramAdvancedData(igId){
    console.log(igId)
    return false
}

async function accountRegister(req,res,done){
    let data = req.body //JSON that comes from view with the instagram username and the ID of the user in Socialytics DB

    if(data.username == "" || data.socialyticId == ""){
        //Case 1: it verifies if the data came empty, it is the 4th test in instagramUser_test.js
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else{
        let basicData = await instagramBasicData(data.username) //Variable to get the basic user instagram data from the function

        if (basicData.statusCode === undefined){
            //Case 2: it verifies if the variable has a statusCode
            if(basicData.is_private == true){
                //Case 3: it verifies if the given username is private account, it is the 2nd test in instagramUser_test.js
                res.status(406).send({
                    status: "406",
                    response:"Not Acceptable",
                    message:"This is a private account, please try again"
                })
            }else{
                //Case 4: Insert of the data, it is the 1st test in instagramUser_test.js
                let advancedData = await instagramAdvancedData(basicData.id)
            }

        }
        else if (basicData.statusCode == '404'){
            //Conditions who verifies if the user does not exist in the instagram BD, it is the 3rd test in instagramUser_test.js
            res.status(404).send({
                status: "404",
                response:"Not Found",
                message:"This user doesn't exist, please try again"
            })
        }
        done()
    }
    
}

async function getInstagramUsername(req,res,done){
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
    instagramBasicData,
    instagramAdvancedData,
    getInstagramUsername
}