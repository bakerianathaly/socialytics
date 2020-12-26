const request = require("request-promise")
const moment = require('moment')
const instagramModel = require('../models/instagram')

async function bestDayToPostByProfileViews(req,res,done){
    let profileViews = null //Variable that contains the response for the facebook request
    /*The next seven variables are the one that will have the prediction of each day of the week, that is the reason 
    they are identify by the name of the day */
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0 
    let totalPrediction = 0 //Variable that contains the total addition of the values of the request
    let fbToken = req.query.fbToken //Variable to handle the facebook token
    let socialytics = req.query.socialyticId //Variable to handle the user identification in the app
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date() //Variable with the today actual date
    
    for(let i = 0; i <3; i++){
        //The loop it is here to make the request 3 times, to get the historical data of 3 differents months 
        if(socialytics == undefined || socialytics == ""){
            //Case 1: It checks for any empty fields in the data.
            return res.status(406).send({
                status: "406",
                response:"Not Acceptable",
                message:"This field is required"
            })
        }
        else if(fbToken){
            //The data from the view it is good to proceed
            //Query to get the instagram user data in the socialytics DB
            try{
                var igUser = await instagramModel.findOne({socialyticId: socialytics}).exec()
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
            else{
                //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
                let ig_Id = igUser.instagramId //Variable with the Instagram ID if the user exits in the socialytics DB
                let sinceDate = moment(today).subtract(31,'days').format() //Variable with the since date for the request (it is the actual date less 31 days)
                let untilDate = moment(today).subtract(1,'days').format() //Variable with the until date for the request (it is the actual date less 1 day)
                today = sinceDate //We update the today date with the since date to get the nexts dates of the other requests in the loop
                
                /*To be able to make the request to the facebook api, we need to transform the since and until date
                to the UNIX date format */
                sinceDate = moment(sinceDate).unix()
                untilDate = moment(untilDate).unix()

                //Request 1 to facebook API: get the historical profile views data (31 days behind), it needs the Facebook token and the Instagram ID
                let petition = {
                    method: "GET",
                    uri: `https://graph.facebook.com/v9.0/${ig_Id}/insights?metric=profile_views&period=day&since=${sinceDate}&until=${untilDate}&access_token=${fbToken}`,
                    resolveWithFullResponse: true,
                    json: true
                }

                await request(petition).then((response) => {
                    profileViews = response.body.data[0].values
                }).catch(function (err) {
                    fail = {
                        status: '400',
                        response: 'Bad Request',
                        message: 'Your session has expired'
                    } 
                })
            }
        }
        else{ 
            //This else is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
            //and we can not make the request to facebook API to get the values
            profileViews = req.query.data
            i = 5
        }

        if(profileViews != null){
            /*To be able to calculate the best day to post, for each one of the value we get in the request, we need
            to check witch day of the week is and with that sum the value to the variable of that day
            
            And also, we need to calculate the total to be able to calculate de percent of probability*/
            for(let i =0; i < profileViews.length; i++){
                let day = moment(profileViews[i].end_time).format('dddd')
                totalPrediction = totalPrediction+profileViews[i].value 
                
                if(day == 'Monday'){
                    monday = monday + profileViews[i].value
                }
                else if(day == 'Tuesday'){
                    tuesday = tuesday + profileViews[i].value
                }
                else if(day == 'Wednesday'){
                    wednesday = wednesday + profileViews[i].value
                }
                else if(day == 'Thursday'){
                    thursday = thursday + profileViews[i].value
                }
                else if(day == 'Friday'){
                    friday = friday + profileViews[i].value
                }
                else if(day == 'Saturday'){
                    saturday = saturday + profileViews[i].value
                }
                else{ 
                    sunday = sunday + profileViews[i].value
                }
            }
        }
        else{
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            }
            i = 5
        }
    }
    //For each variable of the week, it is calculate the confidence interval to get for each day the posible percent of probability of the best day to post 
    monday = (monday/totalPrediction)*100
    tuesday = (tuesday/totalPrediction)*100
    wednesday = (wednesday/totalPrediction)*100
    thursday = (thursday/totalPrediction)*100
    friday = (friday/totalPrediction)*100
    saturday = (saturday/totalPrediction)*100
    sunday = (sunday/totalPrediction)*100

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
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful prediction",
            byProfileViews: {
                sunday: sunday.toFixed(2),
                monday: monday.toFixed(2),
                tuesday: tuesday.toFixed(2),
                wednesday: wednesday.toFixed(2),
                thursday: thursday.toFixed(2),
                friday: friday.toFixed(2),
                saturday: saturday.toFixed(2)
            }
        })
    }

}

async function probableAmountOfReach(req,res,done){
    let probableReach = null //Variable that contains the response for the facebook request
    /*The next seven variables are the one that will have the prediction of each day of the week, that is the reason 
    they are identify by the name of the day */
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0 
    let totalPrediction = 0 //Variable that contains the total addition of the values of the request
    let fbToken = req.query.fbToken //Variable to handle the facebook token
    let socialytics = req.query.socialyticId //Variable to handle the user identification in the app
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date() //Variable with the today actual date
    
    for(let i = 0; i <3; i++){
        //The loop it is here to make the request 3 times, to get the historical data of 3 differents months 
        if(socialytics == undefined || socialytics == ""){
            //Case 1: It checks for any empty fields in the data.
            return res.status(406).send({
                status: "406",
                response:"Not Acceptable",
                message:"This field is required"
            })
        }
        else if(fbToken){
            //The data from the view it is good to proceed
            //Query to get the instagram user data in the socialytics DB
            try{
                var igUser = await instagramModel.findOne({socialyticId: socialytics}).exec()
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
            else{
                //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
                let ig_Id = igUser.instagramId //Variable with the Instagram ID if the user exits in the socialytics DB
                let sinceDate = moment(today).subtract(31,'days').format() //Variable with the since date for the request (it is the actual date less 31 days)
                let untilDate = moment(today).subtract(1,'days').format() //Variable with the until date for the request (it is the actual date less 1 day)
                today = sinceDate //We update the today date with the since date to get the nexts dates of the other requests in the loop
                
                /*To be able to make the request to the facebook api, we need to transform the since and until date
                to the UNIX date format */
                sinceDate = moment(sinceDate).unix()
                untilDate = moment(untilDate).unix()

                //Request 1 to facebook API: get the historical profile views data (31 days behind), it needs the Facebook token and the Instagram ID
                let petition = {
                    method: "GET",
                    uri: `https://graph.facebook.com/v9.0/${ig_Id}/insights?metric=reach&period=day&since=${sinceDate}&until=${untilDate}&access_token=${fbToken}`,
                    resolveWithFullResponse: true,
                    json: true
                }

                await request(petition).then((response) => {
                    probableReach = response.body.data[0].values
                }).catch(function (err) {
                    fail = {
                        status: '400',
                        response: 'Bad Request',
                        message: 'Your session has expired'
                    } 
                })
            }
        }
        else{ 
            //This else is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
            //and we can not make the request to facebook API to get the values
            probableReach = req.query.data
            i = 5
        }

        if(probableReach != null){
            /*To be able to calculate the best day to post, for each one of the value we get in the request, we need
            to check witch day of the week is and with that sum the value to the variable of that day
            
            And also, we need to calculate the total to be able to calculate de percent of probability*/
            for(let i =0; i < probableReach.length; i++){
                let day = moment(probableReach[i].end_time).format('dddd')
                totalPrediction = totalPrediction+probableReach[i].value 
                
                if(day == 'Monday'){
                    monday = monday + probableReach[i].value
                }
                else if(day == 'Tuesday'){
                    tuesday = tuesday + probableReach[i].value
                }
                else if(day == 'Wednesday'){
                    wednesday = wednesday + probableReach[i].value
                }
                else if(day == 'Thursday'){
                    thursday = thursday + probableReach[i].value
                }
                else if(day == 'Friday'){
                    friday = friday + probableReach[i].value
                }
                else if(day == 'Saturday'){
                    saturday = saturday + probableReach[i].value
                }
                else{ 
                    sunday = sunday + probableReach[i].value
                }
            }
        }
        else{
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            }
            i = 5
        }
    }
    
    //For each variable of the week, it is calculate the confidence interval to get for each day the posible percent of probability of the best day to post 
    monday = (monday/totalPrediction)*100
    tuesday = (tuesday/totalPrediction)*100
    wednesday = (wednesday/totalPrediction)*100
    thursday = (thursday/totalPrediction)*100
    friday = (friday/totalPrediction)*100
    saturday = (saturday/totalPrediction)*100
    sunday = (sunday/totalPrediction)*100

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
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful prediction",
            probableReachs: {
                sunday: sunday.toFixed(2),
                monday: monday.toFixed(2),
                tuesday: tuesday.toFixed(2),
                wednesday: wednesday.toFixed(2),
                thursday: thursday.toFixed(2),
                friday: friday.toFixed(2),
                saturday: saturday.toFixed(2)
            }
        })
    }
}

module.exports = {
    bestDayToPostByProfileViews,
    probableAmountOfReach
}