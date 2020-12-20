const request = require("request-promise")
const moment = require('moment')
const instagramModel = require('../models/instagram')
const e = require("express")

async function bestDayToPostByProfileViews(req,res,done){
    let profileViews = null
    /*The next seven variables are the one that will have the prediction of each day of the week, that is the reason 
    they are identify by the name of the day */
    let monday = 0
    let tuesday = 0
    let wednesday = 0
    let thursday = 0
    let friday = 0
    let saturday = 0
    let sunday = 0
    let totalPrediction = 0
    let fbToken = req.body.fbToken
    let socialytics = req.body.socialyticId
    let fail = null //Variable to handle some errors we need to put in some conditions
    let today = new Date()

    //1. Ver si el socialID viene vacio, retornar error (done)
    //2. Si el token viene en la peticion pero el id del usuario no existe,  retonar error (done)
    for(let i = 0; i <3; i++){
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
                return res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"This user doesn't exist, please try again"
                }) 
            }
            else{
                //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
                let ig_Id = igUser.instagramId
                let sinceDate = moment(today).subtract(31,'days').format()
                let untilDate = moment(today).subtract(1,'days').format()
                today = sinceDate
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
                        message: 'Token has expired or has a bad signature'
                    } 
                })
            }
        }
        else{ 
            //This else is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
            //and we can not make the request to facebook API to get the values
            profileViews = req.body.data
        }

        if(profileViews != null){
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
                message: 'Token has expired or has a bad signature'
            }
            i = 5
        }
    }
    //Aqui poner el nombre de que carajo es esto xD es un porcentaje pero no se de que
    monday = (monday/totalPrediction)*100
    tuesday = (tuesday/totalPrediction)*100
    wednesday = (wednesday/totalPrediction)*100
    thursday = (thursday/totalPrediction)*100
    friday = (friday/totalPrediction)*100
    saturday = (saturday/totalPrediction)*100
    sunday = (sunday/totalPrediction)*100

    if(fail != null){
        return res.status(400).send({
            status: fail.status,
            response: fail.response,
            message: fail.message
        })
    }
    else{
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Prediction successful",
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

module.exports = {
    bestDayToPostByProfileViews
}