const instagramController = require('../controllers/basicUserInfo')
const mediaController = require('../controllers/instagramMedia')

module.exports = (app) =>{
    app.get('/instagram/statistics', instagramController.getStatistics)
    app.get('/instagram/getmedia', mediaController.getMedia)
    app.get('/intstagram/newFollowers', instagramController.getNewFollowersStatistics)
}