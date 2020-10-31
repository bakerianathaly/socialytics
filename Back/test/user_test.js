const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

describe("Register tests", () => {

    it("Register successful", done =>{
        let data = {
            name: "Corina",
            lastName: "Smith",
            password: "lsdmklakdmlasmdlakmdslakmdsla",
            email: "corismith19@gmail.com",
            industry: "Influencer"
        }

        request(app).post('/register').send(data).end((err, res) =>{
            assert(res.body.response === "Register successful")
            done()
        })
    })

    it("Fail register", done => {
        let data = {
            name: "Corina",
            lastName: "Smith",
            password: "lsd",
            email: "corismith19@gmail.com",
            industry: "Influencer"
        }

        request(app).post('/register').send(data).end((err, res) =>{
            assert(res.body.err === "This field has to be filled in the required format")
            done()
        })
    })

    it("Fail register due to empty fields", done => {
        let data = {
            name: "Corina",
            lastName: "",
            password: "lsd",
            email: "corismith19@gmail.com",
            industry: ""
        }

        request(app).post('/register').send(data).end((err, res) =>{
            assert(res.body.err === "This field is required")
            done()
        })
    })
}) 