const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

describe("Sign up tests", () => {

    it("Sign up successful", done =>{
        let data = {
            name: "Corina",
            lastName: "Smith",
            password: "lsdmklakdmlasmdlakmdslakmdsla",
            email: "corismith19@gmail.com",
            industry: "Influencer"
        }

        request(app).post('/signup').send(data).end((err, res) =>{
            assert(res.body.message === "Sign up successful")
            done()
        })
    })

    it("Fail sign up due to invalid format", done => {
        let data = {
            name: "Corina",
            lastName: "Smith",
            password: "lsd",
            email: "corismith19@.com",
            industry: "Influencer"
        }

        request(app).post('/signup').send(data).end((err, res) =>{
            assert(res.body.message === "This field has to be filled in the required format")
            done()
        })
    })

    it("Fail sign up due to empty fields", done => {
        let data = {
            name: "Corina",
            lastName: "",
            password: "lsd",
            email: "corismith@gmail.com",
            industry: ""
        }

        request(app).post('/signup').send(data).end((err, res) =>{
            assert(res.body.message === "This field is required")
            done()
        })
    })

    it("Fail sign up due to a taken email", done =>{
        let data = {
            name: "Corina",
            lastName: "Smith",
            password: "lsdmklakdmlasmdlakmdslakmdsla",
            email: "corismith19@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/signup').send(data).end((err, res) =>{
            assert(res.body.message === "Email is invalid or already taken")
            done()
        })
    })
}) 
// pruebas para el Login
describe("Login tests", () => {
    // Caso de login exitoso.
    it("User Logged in Successfully", done =>{
        let data = {
            email: "corismith19@gmail.com",
            password: "lsdmklakdmlasmdlakmdslakmdsla"
        }
        
        request(app).post('/login').send(data).end((err, res) =>{
            assert(res.body.message === "Login Successful")
            done()
        })
    })
    // Caso de ingreso de datos incorrectos.
    it("User entered wrong credentials", done =>{
        let data = {
            email: "corismith19@gmail.com",
            password: "lsdmklakdmlasmdlakmds"
        }
        
        request(app).post('/login').send(data).end((err, res) =>{
            assert(res.body.message === "The e-mail or password you entered is incorrect")
            done()
        })
    })
    // caso de ingreso de campos vacios.
    it("User left empty fields", done =>{
        let data = {
            email: "corismith19@gmail.com",
            password: ""
        }
        
        request(app).post('/login').send(data).end((err, res) =>{
            assert(res.body.message === "This field is required")
            done()
        })
    })
    
    
}) 