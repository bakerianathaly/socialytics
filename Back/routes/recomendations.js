const recomendationController = require('../controllers/recomendationsIg')

module.exports = (app) =>{
    app.post('/recomendations/engagements', recomendationController.getEngagementsProfileViewsRecomendation)
}