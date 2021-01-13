const recomendationController = require('../controllers/recomendationsIg')

module.exports = (app) =>{
    app.post('/recomendations/engagements', recomendationController.getEngagementsProfileViewsRecomendation)
    app.post('/recomendations/amountofpost', recomendationController.getAmountOfPostProfileViewsRecomendation)
    app.post('/recomendations/followersAndProfile', recomendationController.getFollowersAndProfileViewsRecomendation)
}