const userController = require("../controllers/user")

module.exports = (app) =>{
    app.get('/', userController.get) 
    app.post('/signup', userController.register)
    app.post('/login', userController.loggedIn)
}
    
