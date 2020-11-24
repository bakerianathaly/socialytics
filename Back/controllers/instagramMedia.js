const request = require("request-promise")

async function getMedia(fb_Token, ig_Id){

    let mediaId = [] //Variable that containts the id of the first 25 media
    let mediaInfo = [] //Variable that containts the data (counts of likes, counts of comments, type, etc) of the first 25 media
    let totalLikes = 0 //Varaiable that containts the total likes calculation
    let totalComments = 0 //Varaiable that containts the total comments calculation
    let avgLikes = 0 //Varaiable that containts the average likes 
    let avgComments = 0 //Varaiable that containts the average commets
    let countMedia = 0 //Variable with the amount of media returned
    let fail = null //Variable to return the error if it exist 
    
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
            message: 'Token has expired or has a bad signature'
        } 
    })

    //To be able to get more information of the every media, it need to make a request for each one of the media ID we got before
    let i = 0
    while(fail == null && i < countMedia){
        //While error is still null and the i is still less than countMedia the cycle continue
        //Request 2 to facebook API: get the media information, it needs the Facebook token and the each one media  ID to proceed
        let petition = {
            method: "GET",
            uri: `https://graph.facebook.com/v9.0/${mediaId[i]}?fields=caption,comments_count,like_count,media_url,timestamp&access_token=${fb_Token}`,
            resolveWithFullResponse: true,
            json: true
        }

        await request(petition).then((response) => {
            //Wait to response, and if is there none error calculate the totalComments, the totalLikeas and push the media info to the mediaInfo variable
            totalComments = totalComments + response.body.comments_count
            totalLikes = totalLikes + response.body.like_count
            mediaInfo.push(response.body)
            i++
        }).catch(function (err) {
            fail = {
                status: '400',
                response: 'Bad Request',
                message: 'Token has expired or has a bad signature'
            } 
        })
    }

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

    if (fail !=null){
        //It checks if an error has happens, and returned it 
        return fail
    }
    else{
        return allMediaInfo
    }
}

module.exports = {
    getMedia
}