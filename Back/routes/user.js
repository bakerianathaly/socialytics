const userController = require("../controllers/user")

module.exports = (app) =>{
    app.get('/', userController.get) 
    app.post('/register', userController.register)
}
    
