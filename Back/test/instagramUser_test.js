const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

describe("Instagram sign up tests", () => {

    it("Fail instagram sign up due to unknown user", done =>{
    
        let socialyticId = '5faec2f588ri4k56552cb0e9'
        let fbToken = 'EAAV2pKo9RUqdddZAGJXiE3XL4zisU6GQBw3xIWccqaN33b5V4QirZBCMsUAhfeij0sKKrXXgZDZD'
        let url = '/instagram/statistics?fbToken='+fbToken+'&socialyticsId='+socialyticId

        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

    it("Fail instagram sign up due to empty fields", done =>{
        
        let socialyticId = '5faec2f588ri4k56552cb0e9'
        let fbToken = ''
        let url = '/instagram/statistics?fbToken='+fbToken+'&socialyticsId='+socialyticId

        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This field is required")
            done()
        })
    })
})