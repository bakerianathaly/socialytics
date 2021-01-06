//Requires
const instagramModel = require('../models/instagram')
const request = require("request-promise")
const userModel = require('../models/user')
const moment = require('moment')
let statistics  //JSON, it containts all the data recovered and tranforms ready to display in the view

async function instagramBasicUserData(fb_Token, ig_Id){
    let igInfo //Variable that containts the basic user info 
    let fail = null //Variable to return the error if it exist

    //Request 1 to facebook API: get the Instagram user basic infor, it needs the Facebook token and the instagram user ID to proceed
    let petition = {
        method: "GET",
        uri: `https://graph.facebook.com/v3.2/${ig_Id}?fields=username,biography,followers_count,follows_count,media_count,name,profile_picture_url,website&access_token=${fb_Token}`,
        resolveWithFullResponse: true,
        json: true
    }

    await request(petition).then((response) => {
        //Wait to response, and if is there none error asinged the info to the variable
        igInfo = response.body
    }).catch(function (err) {
        fail = {
            status: '400',
            response: 'Bad Request',
            message: 'Your session has expired'
        } 
    })

    if (fail != null){
        //It checks if an error has happens, and returned it 
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
            message:"Couldn’t process your request due to missing params inside the request"
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
            //Wait to response, and if is there none error asinged the ID to the variable
            fbPageId = response.body.data[0].id
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            } 
        })

        if (fail != null){
            //It checks if an error has happens, and returned it 
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
            //Wait to response, and if is there none error asinged the ID to the variable
            igId = response.body.instagram_business_account.id
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            } 
        })

        if (fail != null){
            //It checks if an error has happened, and return it 
            return fail 
        }
        
        //Case 1: Insert the user intagram ID and facebook page ID to the DB
        let data = {
            facebookId: fbPageId,
            instagramId: igId,
            socialyticId: socialytics_Id
        }

        try{
            //Try to insert the new Instagram user and it is return if the insertion was good
            var newUser = new instagramModel(data)
            var register = await newUser.save()
            return register
        }catch(err){
            //Return error if something happens in the insertion
            return {
                status: "404",
                response:"Not Found",
                message: "The sign up of the Instagram has failed due to an error"
            }
        }
    }
}

async function getStatistics(req,res,done){
    
    var data = String //Data's from the view, it is the Facebook token and the socialytics user ID
    data = req.query;
    var error = null //Variable to handle some errors we need to put in some conditions
   
    //Query to get the user by the socialyticsiD  {_id: data.socialyticsId}
    try{
        var user = await userModel.findById(data.socialyticsId).exec()
    }catch(err){
        error = err.messageFormat
    }
    if(data.fbToken == "" || data.socialyticsId == "" ){
        //Case 1: It checks for any empty fields in the data.
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Couldn’t process your request due to missing params inside the request"
        })
    }
    else if(error == undefined && user == undefined){
        //Case 2: It checks if the user exists in the DB.
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"This user doesn't exist, please try again"
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
                //Case 5: It checks if any of the request came with an error and send an error to the view
                return res.status(400).send({
                    status: '400',
                    response: 'Bad Request',
                    message: igUser.message
                })
            }   
        }

        //Request 1 to facebook API: get the instagram user basic data (in the instagramBasicUserData function), it needs the instagram page ID and the facebook token
        let userData = await instagramBasicUserData(data.fbToken, igUser.instagramId)

        if(userData.status != undefined){
            //Case 6: It checks if any of the request came with an error and send an error to the view
            return res.status(400).send({
                status: '400',
                response: 'Bad Request',
                message: userData.message
            })
        }

        //JSON with the return information os the instagram
        statistics = {
            userData: userData
        }
        //Sucessful response message 
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Sign up successful",
            instagram: statistics
        })
    }
}

async function getNewFollowersStatistics(req,res,done){
    let test_data = req.body.data
    let fbToken = req.body.fbToken //Variable to handle the facebook token
    let socialyticId = req.body.socialyticId //Variable to handle the user identification in the app
    let newFollowers = null //Variable that contains the new followers values
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date() //Variable with the today actual date
    /*The next seven variables are the one that will have the follower count for each day of the week for the past 30 days, 
    that is the reason they are identify by the name of the day and they are an arrays */
    let monday = []
    let tuesday = []
    let wednesday = []
    let thursday = []
    let friday = []
    let saturday = []
    let sunday = [] 
    let weeks = [] //Variable that contains the values of each days of the week but in a format week
    let totalChangeFollowers = 0//Variable that containts the total chage

    if(test_data != undefined){
        //This condition is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
        //and we can not make the request to facebook API to get the values
        newFollowers = test_data
    }
    else if((fbToken == undefined || fbToken == "") || (socialyticId == undefined || socialyticId == "")){
        //Case 1: It checks for any empty fields in the data.
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Couldn’t process your request due to missing params inside the request"
        })
    }
    else{
        //The data from the view it is good to proceed to get the follower count data from the facebook API
        //Query to get the instagram user data in the socialytics DB
        try{
            var igUser = await instagramModel.findOne({socialyticId: socialyticId}).exec()
        }catch(err){
            fail = err.messageFormat
        }

        if(fail == undefined && igUser == undefined){
            //Case 2: It checks if the user exists in the DB.
            //It checks if an error has happens, and returned it 
            return res.status(409).send({
                status: "409",
                response:"Conflict",
                message:"This user doesn't exist, please try again"
            }) 
        }
        let instagramId = igUser.instagramId //Variable with the Instagram ID if the user exits in the socialytics DB
        //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the new followers
        let sinceDate = moment(today).subtract(30,'days').format() //Variable with the since date for the request (it is the actual date less 31 days)
        let untilDate = moment(today).subtract(1,'days').format() //Variable with the until date for the request (it is the actual date less 1 day)
        
        /*To be able to make the request to the facebook api, we need to transform the since and until date
        to the UNIX date format */
        sinceDate = moment(sinceDate).unix()
        untilDate = moment(untilDate).unix()

        //Request 1 to facebook API: get the follower count of last 30 days excluding the current date, it needs the Facebook token and the Instagram ID
        let petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/${instagramId}/insights?metric=follower_count&period=day&since=${sinceDate}&until=${untilDate}&access_token=${fbToken}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            newFollowers = response.body.data[0].values
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            } 
        })
    }

    for(let i= 0; i < newFollowers.length; i++){
        /*To be able to get the value for each week, first we need to check which day of the week is that value and with that,
        sum that value to the total change variable and push it to the correct array of the day that correspond.*/
        let day = moment(newFollowers[i].end_time).format('dddd')
        totalChangeFollowers = totalChangeFollowers + newFollowers[i].value

        if(day == 'Monday'){
            monday.push(newFollowers[i].value)
        }
        else if(day == 'Tuesday'){
            tuesday.push(newFollowers[i].value)
        }
        else if(day == 'Wednesday'){
            wednesday.push(newFollowers[i].value)
        }
        else if(day == 'Thursday'){
            thursday.push(newFollowers[i].value)
        }
        else if(day == 'Friday'){
            friday.push(newFollowers[i].value)
        } 
        else if(day == 'Saturday'){
            saturday.push(newFollowers[i].value)
        }
        else{ 
            sunday.push(newFollowers[i].value)
        }
    }
    
    for(let i= 0; i < 4; i++){
        /*After getting all the arrays for each day of the week (with the corresponding value for each day and not more that 4 value por array)
        we proceed to organized the weeks for having easy access to them.*/
        let auxFormatWeeks = [
            sunday[i],monday[i],tuesday[i],wednesday[i],thursday[i],friday[i],saturday[i]
        ]
        weeks.push(auxFormatWeeks)
    }

    if(fail != null){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: fail.status,
            response: fail.response,
            message: fail.message
        })
    }
    else{
        //Case 4: Sucessful response message and JSON
        let maxOfEachWeek = [
            Math.max(...weeks[0]),
            Math.max(...weeks[1]),
            Math.max(...weeks[2]),
            Math.max(...weeks[3])
        ] //Array variable, it has the max value for each of the 4 weeks 
        let minOfEachWeek = [
            Math.min(...weeks[0]),
            Math.min(...weeks[1]),
            Math.min(...weeks[2]),
            Math.min(...weeks[3])
        ] //Array variable, it has the min value for each of the 4 weeks 

        let avgChangeFollowers = totalChangeFollowers/newFollowers.length //Variable for get the average change of followers
        maxOfEachWeek = Math.max(...maxOfEachWeek) //The calculation of the max value for the array of follower count we initialize before
        minOfEachWeek = Math.max(...minOfEachWeek) //The calculation of the min value for the array of follower count we initialize before

        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful follower description graphic",
            week1: weeks[0],
            week2: weeks[1],
            week3: weeks[2],
            week4: weeks[3],
            totalChangeFollowers,
            avgChange: avgChangeFollowers.toFixed(2),
            maxOfEachWeek,
            minOfEachWeek
        })
    }
}

module.exports = {
    instagramBasicUserData,
    newInstagramUser,
    getStatistics,
    getNewFollowersStatistics
}