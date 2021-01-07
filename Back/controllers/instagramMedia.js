const request = require("request-promise")
const instagramModel = require('../models/instagram')

async function getMedia(req,res,done){
    let fb_Token = req.query.fbToken //Variable to handle the facebook token
    let userID = req.query.socialyticId //Variable to handle the user identification in the app
    let ig_Id //Variable with the Instagram ID if the user exits in the socialytics DB
    let mediaId = [] //Variable that containts the id of the first 25 media
    let mediaInfo = [] //Variable that containts the data (counts of likes, counts of comments, type, etc) of the first 25 media
    let totalLikes = 0 //Varaiable that containts the total likes calculation
    let totalComments = 0 //Varaiable that containts the total comments calculation
    let avgLikes = 0 //Varaiable that containts the average likes 
    let avgComments = 0 //Varaiable that containts the average commets
    let countMedia = 0 //Variable with the amount of media returned
    let fail = null //Variable to return the error if it exists 

    if(userID == undefined || userID == "" || fb_Token == undefined || fb_Token == ""){
        //Case 1: It checks for any empty fields in the data.
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Couldn’t process your request due to missing params inside the request"
        })
    }
    else{
        //The data from the view it is good to proceed
        //Query to get the instagram user data in the socialytics DB
        try{
            var igUser = await instagramModel.findOne({socialyticId: userID}).exec()
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

        ig_Id = igUser.instagramId
        //Request 1 to facebook API: get the media IDs, it needs the Facebook token and the instagram user ID to proceed
        let petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/${ig_Id}/media?access_token=${fb_Token}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            //Wait to response, and if is there none error asinged the response length to the countMedia variable
            countMedia = response.body.data.length
            //To get every id to push it to the mediaId variable we need to get the value out with a for cycle
            for(let i = 0; i < countMedia; i++){
                mediaId.push(response.body.data[i].id)
            }
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            } 
        })
    }

    //To be able to get more information of the every media, it need to make a request for each one of the media ID we got before
    for(let i = 0; i < 25; i++){
        //While the i is still less than countMedia the cycle continue
        //Request 2 to facebook API: get the media information, it needs the Facebook token and the each one media  ID to proceed
        let petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/${mediaId[i]}?fields=caption,comments_count,like_count,media_url,media_type,timestamp&access_token=${fb_Token}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            //Wait to response, and if is there none error calculate the totalComments, the totalLikeas and push the media info to the mediaInfo variable
            totalComments = totalComments + response.body.comments_count
            totalLikes = totalLikes + response.body.like_count
            mediaInfo.push(response.body)
        }).catch(function (err) {
            i = 100
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Your session has expired'
            } 
        })
    }

    if(fail != null){
        return res.status(fail.status).send({
            status: fail.status,
            response: fail.response,
            message: fail.message
        }) 
    }
    else{
        //Calculation of the average
        avgComments = totalComments / (countMedia-1)
        avgLikes = totalLikes / (countMedia-1)

        //Initialation of the JSON that it will be returned if the error variable is still null
        let allMediaInfo = {
            totalLikes: totalLikes,
            totalComments: totalComments,
            avgLikes: avgLikes.toFixed(2),
            avgComments: avgComments.toFixed(2),
            countMedia: countMedia,
            mediaInfo: mediaInfo
        }

        //Case 4: Sucessful response message and JSON
        return res.status(200).send({
            status: "200",
            response:"OK",
            message: "Got media successful",
            allMediaInfo
        })
    }
}

async function getFrequencyTypeOfPost(req, res, done){
    let socialyticId = req.body.socialyticId //Variable to handle the user identification in the app
    let media = req.body.media //Variable that containts de media data, this data is request by the view in getMedia method
    let frequencyTypePost = null //Variable that contains the response for the profile views function
    let fail = null //Variable to handle some errors we need to put in some conditions
    let test_data = req.body.data
    //Variable that will has the amount of each post type
    let image = 0
    let video = 0
    let carouselAlbum = 0

    if(test_data != undefined){
        //This condition is ONLY use for the TDD, to test the Successfull case. The reason is that the facebook token comes from the view
        //and we can not make the request to facebook API to get the values
        media = test_data 
    }
    else if((socialyticId == undefined || socialyticId == "") || (media == undefined || media == "")){
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
    }

    //Case 3: The user exists we proceed to make the request to Facebook API to get the values of the profile views
    for(let i = 0; i< media.mediaInfo.length; i++){
        if(media.mediaInfo[i].media_type == 'IMAGE'){
            image = image + 1
        }
        else if(media.mediaInfo[i].media_type == 'VIDEO'){
            video = video + 1
        }
        else{ //CAROUSEL_ALBUM
            carouselAlbum = carouselAlbum + 1
        }
    }

    console.log('IMAGE', image)

    return res.status(200).send({
        status: "200",
        response:"OK",
        message: "Frequency of your differents type of post",
        
    })
}

module.exports = {
    getMedia,
    getFrequencyTypeOfPost
}