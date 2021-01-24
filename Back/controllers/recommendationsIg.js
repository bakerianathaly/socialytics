const request = require("request-promise")
const moment = require('moment')
const instagramModel = require('../models/instagram')

async function getProfileViewsData(fbToken, instagramId, test_data){
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
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date() //Variable with the today actual date
    
    for(let i = 0; i <3; i++){
        //The loop it is here to make the request 3 times, to get the historical data of 3 differents months 
        if(fbToken && instagramId){
            //Case 1: The user exists we proceed to make the request to Facebook API to get the values of the profile views
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
                uri: `https://graph.facebook.com/v9.0/${instagramId}/insights?metric=profile_views&period=day&since=${sinceDate}&until=${untilDate}&access_token=${fbToken}`,
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
                i = 5
            })
            
        }
        else{ 
            //This else is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
            //and we can not make the request to facebook API to get the values
            profileViews = test_data
            i = 5
        }

        if(profileViews != null){
            /*To be able to calculate the best day to post, for each one of the value we get in the request, we need
            to check which day of the week is and with that sum the value to the variable of that day
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
        return {
            status: fail.status,
            response: fail.response,
            message: fail.message
        }
    }
    else{
        //Case 4: Sucessful response message and JSON
        let byProfileViews = {
            sunday: sunday.toFixed(2),
            monday: monday.toFixed(2),
            tuesday: tuesday.toFixed(2),
            wednesday: wednesday.toFixed(2),
            thursday: thursday.toFixed(2),
            friday: friday.toFixed(2),
            saturday: saturday.toFixed(2)
        }
        return byProfileViews
    }
}

async function getEngagementsProfileViewsRecommendation(req, res, done){
    let fbToken = req.body.fbToken//Variable to handle the facebook token
    let socialyticId = req.body.socialyticId //Variable to handle the user identification in the app
    let media = req.body.media //Variable that containts de media data, this data is request by the view in getMedia method
    let test_data = req.body.data
    let profileViews = null //Variable that contains the response for the profile views function
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
    let fail = null //Variable to handle some errors we need to put in some conditions

    if(test_data != undefined){
        //This condition is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
        //and we can not make the request to facebook API to get the values
        profileViews = await getProfileViewsData('','',test_data)
    }
    else if((fbToken == undefined || fbToken == "") || (socialyticId == undefined || socialyticId == "") || (media == undefined || media == "")){
        //Case 1: It checks for any empty fields in the data.
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Couldn’t process your request due to missing params inside the request"
        })
    }
    else{
        //The data from the view it is good to proceed to get the profile views prediction data
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
        else{
            //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
            let ig_Id = igUser.instagramId //Variable with the Instagram ID if the user exits in the socialytics DB
            profileViews = await getProfileViewsData(fbToken, ig_Id, '')
        }
    }
    totalPrediction = media.totalComments + media.totalLikes
    for(let i =0; i < media.mediaInfo.length; i++){
        /*To be able to calculate the best day to post, for each one of the value we get in the media, we need
        to check which day of the week is and with that sum the value to the variable of that day
        And also, we need to calculate the total to be able to calculate de percent of probability*/
        let day = moment(media.mediaInfo[i].timestamp).format('dddd')

        if(day == 'Monday'){
            monday = monday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else if(day == 'Tuesday'){
            tuesday = tuesday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else if(day == 'Wednesday'){
            wednesday = wednesday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else if(day == 'Thursday'){
            thursday = thursday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else if(day == 'Friday'){
            friday = friday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else if(day == 'Saturday'){
            saturday = saturday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
        }
        else{ 
            sunday = sunday + media.mediaInfo[i].like_count + media.mediaInfo[i].comments_count
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
    else if(profileViews.status == '400'){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: profileViews.status,
            response: profileViews.response,
            message: profileViews.message
        })
    }
    else{
        //Case 4: Sucessful, response message and JSON
        let allDaysValues= [
            sunday.toFixed(2),
            monday.toFixed(2),
            tuesday.toFixed(2),
            wednesday.toFixed(2),
            thursday.toFixed(2),
            friday.toFixed(2),
            saturday.toFixed(2)
        ]//Array variable, this one is only use to get the max value for the engagements and profile views probability values 
        let maxValueEngagements = Math.max(...allDaysValues) //Variable that has the max value for the engagements json

        allDaysValues = [
            profileViews.sunday,
            profileViews.monday,
            profileViews.tuesday,
            profileViews.wednesday,
            profileViews.thursday,
            profileViews.friday,
            profileViews.saturday
        ]
        let maxValueProfileViews = Math.max(...allDaysValues) //Variable that has the max value for the profile views json
       
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful recommendation",
            probableEngagements: {
                sunday: sunday.toFixed(2),
                monday: monday.toFixed(2),
                tuesday: tuesday.toFixed(2),
                wednesday: wednesday.toFixed(2),
                thursday: thursday.toFixed(2),
                friday: friday.toFixed(2),
                saturday: saturday.toFixed(2)
            },
            maxValueEngagements,
            profileViews,
            maxValueProfileViews
        })
    }
}

async function getAmountOfPostProfileViewsRecommendation(req, res, done){
    let fbToken = req.body.fbToken //Variable to handle the facebook token
    let socialyticId = req.body.socialyticId //Variable to handle the user identification in the app
    let media = req.body.media //Variable that containts de media data, this data is request by the view in getMedia method
    let test_data = req.body.data
    let profileViews = null //Variable that contains the response for the profile views function
    /*The next seven variables are the one that will have the prediction of each day of the week, that is the reason 
    they are identify by the name of the day */
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0 
    let fail = null //Variable to handle some errors we need to put in some conditions

    if(test_data != undefined){
        //This condition is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
        //and we can not make the request to facebook API to get the values
        profileViews = await getProfileViewsData('','',test_data)
    }
    else if((fbToken == undefined || fbToken == "") || (socialyticId == undefined || socialyticId == "") || (media == undefined || media == "")){
        //Case 1: It checks for any empty fields in the data.
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Couldn’t process your request due to missing params inside the request"
        })
    }
    else{
        //The data from the view it is good to proceed to get the profile views prediction data
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
        else{
            //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
            let ig_Id = igUser.instagramId //Variable with the Instagram ID if the user exits in the socialytics DB
            profileViews = await getProfileViewsData(fbToken, ig_Id, '')
        }
    }
    
    for(let i =0; i < media.mediaInfo.length; i++){
        /*To be able to calculate the best day to post, for each one of the value we get in the media, we need
        to check which day of the week is and with that we sum 1 to the variable of the day to get
        the amount of post we published each day*/
        let day = moment(media.mediaInfo[i].timestamp).format('dddd')

        if(day == 'Monday'){
            monday = monday + 1
        }
        else if(day == 'Tuesday'){
            tuesday = tuesday + 1
        }
        else if(day == 'Wednesday'){
            wednesday = wednesday + 1
        }
        else if(day == 'Thursday'){
            thursday = thursday + 1
        }
        else if(day == 'Friday'){
            friday = friday + 1
        }
        else if(day == 'Saturday'){
            saturday = saturday + 1
        }
        else{ 
            sunday = sunday + 1
        }
    }

    if(fail != null){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: fail.status,
            response: fail.response,
            message: fail.message
        })
    }
    else if(profileViews.status == '400'){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: profileViews.status,
            response: profileViews.response,
            message: profileViews.message
        })
    }
    else{
        //Case 4: Sucessful, response message and JSON
        let allDaysValues= [
            sunday,
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday
        ]//Array variable, this one is only use to get the max value for the engagements and profile views probability values 
        let maxValueAmountOfPicture = Math.max(...allDaysValues) //Variable that has the max value for the engagements json

        allDaysValues = [
            profileViews.sunday,
            profileViews.monday,
            profileViews.tuesday,
            profileViews.wednesday,
            profileViews.thursday,
            profileViews.friday,
            profileViews.saturday
        ]
        let maxValueProfileViews = Math.max(...allDaysValues) //Variable that has the max value for the profile views json
       
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful recommendation",
            amountOfPictures: {
                sunday: sunday,
                monday: monday,
                tuesday: tuesday,
                wednesday: wednesday,
                thursday: thursday,
                friday: friday,
                saturday: saturday
            },
            maxValueAmountOfPicture,
            profileViews,
            maxValueProfileViews
        })
    }
}

async function getFollowersAndProfileViewsRecommendation(req, res, done){
    let profileViews= null //Variable that contains the response for the facebook request
    let newFollowers= null // variable that contains the response for the facebook request for the new followers
    let test_data=req.body.data
    let test_follower_data=req.body.Followers
    /*The next seven variables are the ones that will have the prediction of each day of the week, that is the reason why
    they are identified by the name of the day */
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0 
    let totalPredictionFPV = 0 //Variable that contains the total addition of the values of the request
    let fbToken = req.body.fbToken //Variable to handle the facebook token
    let socialyticId = req.body.socialyticId //Variable to handle the user identification in the app
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date() //Variable with the today actual date

    if(test_data != undefined && test_follower_data!=undefined){
        //This condition is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
        //and we can not make the request to facebook API to get the values
        newFollowers =test_follower_data
        profileViews= await getProfileViewsData('','',test_data)

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
        profileViews = await getProfileViewsData(fbToken,instagramId, '') // it contains what getProfileViewsData returns.
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
        totalPredictionFPV = totalPredictionFPV + newFollowers[i].value

        if(day == 'Monday'){
            monday= monday + newFollowers[i].value
        }
        else if(day == 'Tuesday'){
            tuesday= tuesday + newFollowers[i].value
        }
        else if(day == 'Wednesday'){
            wednesday= wednesday + newFollowers[i].value
        }
        else if(day == 'Thursday'){
            thursday= thursday + newFollowers[i].value
        }
        else if(day == 'Friday'){
            friday= friday + newFollowers[i].value
        } 
        else if(day == 'Saturday'){
            saturday= saturday + newFollowers[i].value
        }
        else{ 
            sunday= sunday + newFollowers[i].value
        }
    }

    //For each variable of the week, it is calculate the confidence interval to get for each day the posible percent of probability of the new followers
    monday = (monday/totalPredictionFPV)*100
    tuesday = (tuesday/totalPredictionFPV)*100
    wednesday = (wednesday/totalPredictionFPV)*100
    thursday = (thursday/totalPredictionFPV)*100
    friday = (friday/totalPredictionFPV)*100
    saturday = (saturday/totalPredictionFPV)*100
    sunday = (sunday/totalPredictionFPV)*100

    if(fail != null){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: fail.status,
            response: fail.response,
            message: fail.message
        })
    }
    else if(profileViews.status == '400'){
        //It checks if an error has happens, and returned it 
        return res.status(400).send({
            status: profileViews.status,
            response: profileViews.response,
            message: profileViews.message
        })
    }
    else{
        //Case 4: Sucessful, response message and JSON
        let allDaysValues= [
            sunday.toFixed(2),
            monday.toFixed(2),
            tuesday.toFixed(2),
            wednesday.toFixed(2),
            thursday.toFixed(2),
            friday.toFixed(2),
            saturday.toFixed(2)
        ]//Array variable, this one is only use to get the max value for the new followers and profile views probability values 
        let maxValueNewFollowers = Math.max(...allDaysValues) //Variable that has the max value for the new followers json

        allDaysValues = [
            profileViews.sunday,
            profileViews.monday,
            profileViews.tuesday,
            profileViews.wednesday,
            profileViews.thursday,
            profileViews.friday,
            profileViews.saturday
        ]
        let maxValueProfileViews = Math.max(...allDaysValues) //Variable that has the max value for the profile views json
       
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Successful recommendation",
            probableFollowers: {
                sunday: sunday.toFixed(2),
                monday: monday.toFixed(2),
                tuesday: tuesday.toFixed(2),
                wednesday: wednesday.toFixed(2),
                thursday: thursday.toFixed(2),
                friday: friday.toFixed(2),
                saturday: saturday.toFixed(2)
            },
            maxValueNewFollowers,
            profileViews,
            maxValueProfileViews
        })
    }

}

module.exports = {
    getEngagementsProfileViewsRecommendation,
    getAmountOfPostProfileViewsRecommendation,
    getFollowersAndProfileViewsRecommendation
}