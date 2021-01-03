const assert = require("assert") //To make the boolean comparison
const request = require("supertest") //It allows us to make calls to our own api 
const app = require("../index") //The server needs to be invoked because that's where the paths are invoked

//Sign up tests
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

// Login test cases.
describe("Login tests", () => {
    // Case: Login successful.
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
    // Case:Incorrect entered values.
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
    // Case: If there are any empty fields in the form.
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

// test for update user's data 
describe("Update user tests", () => {
    //Case 1: User updates his data successfully.
    it("User's data was updated", done =>{
        let user = {
            name: "eduardo",
            lastName: "Sanoja",
            password: "12345678",
            email: "edsanoja@gmail.com",
            industry: "Influencer"
        }

        request(app).post('/signup').send(user).end((err, res) =>{

           let updatedUser = {
                id:res.body.id,
                name: "edward",
                lastName: "Sano",
                password: "12345678",
                email: "edsanoja@gmail.com",
                industry: "Influencer"
            }
        
            request(app).post('/update').send(updatedUser).end((err, res) =>{
                
                assert(res.body.message === "The update has been successful")
                done()
            })
        })
    })

    //Case 2: User left empty fields.
    it("User left empty fields", done =>{
        let data = {
            name: "",
            lastName: "",
            password: "12345678",
            email: "edsanoja@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/update').send(data).end((err, res) =>{
            assert(res.body.message === "Empty fields are not allowed")
            done()
        })
    })


    //Case 3: User entered a wrong email format.
    it("User's data wasn't updated due to a wrong email format entered", done =>{
        let data = {
            name: "edward",
            lastName: "Sano",
            password: "12345678",
            email: "ed",
            industry: "Influencer"
        }
        
        request(app).post('/update').send(data).end((err, res) =>{
            assert(res.body.message === "This Email is on the wrong format, please try again")
            done()
        })
    })
    //Case 4: User entered a wrong password format.
    it("User's data wasn't updated due to an invalid password format entered", done =>{
        let data = {
            name: "edward",
            lastName: "Sano",
            password: "lsdm",
            email: "edsanoja@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/update').send(data).end((err, res) =>{
            assert(res.body.message === "This password is on the wrong format, please try again")
            done()
        })
    })
})