const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

describe("Register tests", () => {

    it("Register successful", done =>{
        let data = {id:0, country: "Croacia", year: 2017, days: 10}

        request(app).post('/register').send(data).end((err, res) =>{
            assert(res.body.response === "Register successful")
            done()
        })
    })
}) 