const instagramController = require('../controllers/basicUserInfo')
const mediaController = require('../controllers/instagramMedia')

module.exports = (app) =>{
    app.get('/instagram/statistics', instagramController.getStatistics)
    app.get('/instagram/getmedia', mediaController.getMedia)
    app.post('/intstagram/newFollowers', instagramController.getNewFollowersStatistics)
    app.post('/instagram/typeMediaFrequency', mediaController.getFrequencyTypeOfPost)
    app.post('/instagram/topMediaPost', mediaController.getTopMediaPost)
}