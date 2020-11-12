const instagramController = require('../controllers/instagram')

module.exports = (app) =>{
    app.post('/instagram/', instagramController.accountRegister),
    app.get('/instagram/get', instagramController.getInstagramUsername)
}