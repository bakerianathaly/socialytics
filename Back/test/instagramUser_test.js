const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

describe("Instagram sign up tests", () => {

    it("Instagram sign up successful", done =>{
        let register = {
            name: "Jeffree",
            lastName: "Star",
            password: "12345678910",
            email: "corismith19@gmail.com",
            industry: "Influencer"
        }

        request(app).post('/signup').send(register).end((err, res) =>{
            let data = {
                username: "jeffreestar",
                socialyticId: res.body.id
            }
            console.log(res)
            request(app).post('/instagram/').send(data).end((err, res) =>{
                console.log(res.body)
                assert(res.body.message === "Account added successfully")
                done()
            })
        })
    })

    it("Fail instagram sign up due to access error", done =>{
        let data = {
            username: "bakerianathaly"
        }

        request(app).post('/instagram/').send(data).end((err, res) =>{
            assert(res.body.message === "This is a private account, please try again")
            done()
        })
    })

    it("Fail instagram sign up due to unknown user", done =>{
        let data = {
            username: "bakeriana"
        }

        request(app).post('/instagram/').send(data).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

    it("Fail instagram sign up due to empty fields", done =>{
        let data = {
            username: " "
        }

        request(app).post('/instagram/').send(data).end((err, res) =>{
            assert(res.body.message === "This field is required")
            done()
        })
    })
})