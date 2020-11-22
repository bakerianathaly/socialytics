//Models
const instagramModel = require('../models/instagram')
const request = require("request-promise")
const userModel = require('../models/user')
const statistics = [] //Array of JSON, it containts all the data recovered and tranforms ready to display in the view

async function instagramBasicUserData(fb_Token, ig_Id){
    let igInfo
    let fail = null

    let petition = {
        method: "GET",
        uri: `https://graph.facebook.com/v3.2/${ig_Id}?fields=username,biography,followers_count,follows_count,media_count,name,profile_picture_url,website&access_token=${fb_Token}`,
        resolveWithFullResponse: true,
        json: true
    }

    await request(petition).then((response) => {
        igInfo = response.body
    }).catch(function (err) {
        fail = {
            status: '400',
            response: 'Bad Request',
            message: 'Token has expired or has a bad signature'
        } 
    })

    if (fail != null){
        return fail
    }
    else{ 
        return igInfo
    }
}

async function newInstagramUser(socialytics_Id, fb_Token){
    var fbPageId //Variable that containts the facebook page ID that the user selected 
    var igId //Variable that containts the instagram business ID vinculed to the facebook page
    var fail = null //Variable to return the error if it exist 

    if(fb_Token == "" || socialytics_Id == "" ){
        //Case 1: It checks for any empty fields in the data.
        return {
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        }
    }
    else{
        //Case 2: Data it is good to proceed
        //Request 1 to facebook API: get the facebook page ID, it needs the Facebook token to proceed
        let petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/me/accounts?access_token=${fb_Token}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            fbPageId = response.body.data[0].id
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Token has expired or has a bad signature'
            } 
        })

        if (fail != null){
            return fail
        }
        
        //Request 2 to facebook API: get the instagram ID related to the facebook page, it needs the facebook page ID and the facebook token
        petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/${fbPageId}?fields=instagram_business_account&access_token=${fb_Token}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            igId = response.body.instagram_business_account.id
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Token has expired or has a bad signature'
            } 
        })

        if (fail != null){
            return fail 
        }
        
        //Case 1: Insert the user intagram ID and facebook page ID to the DB
        let data = {
            facebookId: fbPageId,
            instagramId: igId,
            socialyticId: socialytics_Id
        }

        try{
            var newUser = new instagramModel(data)
            var register = await newUser.save()
            return register
        }catch(err){
            return {
                status: "404",
                response:"Not Found",
                message: "The sign up of the Instagram has failed due to an error"
            }
        }
    }
}

async function getStatistics(req,res,done){
    //Data's from the view, it is the Facebook token and the socialytics user ID
    var data = String
    data = req.query;
    var error = null//Variable to handle some errors we need to put in some conditions
    //Query to get the user by the socialyticsiD  {_id: data.socialyticsId}

    console.log('[DATA]', data)
    try{
        var user = await userModel.findById(data.socialyticsId).exec()
    }catch(err){
        error = err.messageFormat
    }
    if(data.fbToken == "" || data.socialyticsId == "" ){
        //Case 1: It checks for any empty fields in the data.
        res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"This field is required"
        })
    }
    else if(error == undefined && user == undefined){
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
        var igUser = await instagramModel.findOne({socialyticId: data.socialyticsId}).exec()

        if(igUser == null){
            //Case 4: It checks if the instagram user data exits in the DB
            let igUser = await newInstagramUser(data.socialyticsId,data.fbToken)

            if(igUser.status != undefined){
                res.status(400).send({
                    status: '400',
                    response: 'Bad Request',
                    message: igUser.message
                })
            }   
        }

        //Request 1 to facebook API: get the instagram user basic data (in the instagramBasicUserData function), it needs the instagram page ID and the facebook token
        let userData = await instagramBasicUserData(data.fbToken, igUser.instagramId)
        if(userData.status != undefined){
            res.status(400).send({
                status: '400',
                response: 'Bad Request',
                message: userData.message
            })
        }
        statistics.push(userData)
        res.status(200).send({
            status: "200",
            response:"OK",
            message: "Sign up successful",
            instagram: statistics
        })
    }
}

module.exports = {
    getStatistics,
    newInstagramUser,
    instagramBasicUserData
}