const predictionController = require('../controllers/predictionIg')

module.exports = (app) =>{
    app.get('/prediction/bestdaybyviews', predictionController.bestDayToPostByProfileViews)
}