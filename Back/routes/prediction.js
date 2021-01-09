const predictionController = require('../controllers/predictionIg')

module.exports = (app) =>{
    app.get('/prediction/bestdaybyviews', predictionController.bestDayToPostByProfileViews)
    app.get('/prediction/probablereach', predictionController.probableAmountOfReach)
    app.get('/prediction/probableimpressions', predictionController.probableAmountOfImpressions)
    app.post('/prediction/bestdaybyengagement', predictionController.bestDayToPostByEngagement)
}