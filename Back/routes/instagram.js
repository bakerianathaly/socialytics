const instagramController = require('../controllers/instagramAPI')

module.exports = (app) =>{
    app.get('/instagram/statistics', instagramController.getStatistics)
}