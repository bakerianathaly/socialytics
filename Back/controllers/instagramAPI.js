//Models
const instagramModel = require('../models/instagram')
const request = require("request-promise")
const userModel = require('../models/user')

async function getStatistics(req,res,done){
    //Data's from the view, it is the Facebook token and the socialytics user ID
    var data = String
    data = req.query;

    //Query to get the user by the socialyticsiD 
    var user = await userModel.findById(data.socialyticsId).exec()

    if(data.fbToken == "" || data.socialyticsId == "" ){
        //Case 1: It checks for any empty fields in the data.
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else if(user == null){
        //Case 2: It checks if the user exists in the DB.
        res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"This user does not exist in Socialytics"
        }) 
    }
    else{
        //Case 3: The data from the view it is good to proceed
        //Query to get the instagram user data in the socialytics DB
        var igUser = await instagramModel.findById(data.socialyticsId).exec()

        if(igUser == null){
            //Case 4: It checks if the instagram user data exits in the DB
            res.status(409).send({
                status: "409",
                response:"Conflict",
                message:"This instagram user does not exist in Socialytics"
            })
        }
    }
}

module.exports = {
    getStatistics
}