const recommendationController = require('../controllers/recommendationsIg')

module.exports = (app) =>{
    app.post('/recommendations/engagements', recommendationController.getEngagementsProfileViewsRecommendation)
    app.post('/recommendations/amountofpost', recommendationController.getAmountOfPostProfileViewsRecommendation)
    app.post('/recommendations/followersAndProfile', recommendationController.getFollowersAndProfileViewsRecommendation)
}