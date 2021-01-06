const assert = require("assert") //To make the boolean comparison
const request = require("supertest") //It allows us to make calls to our own api 
const app = require("../index") //The server needs to be invoked because that's where the paths are invoked

//Sign up of the instagram user test
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
            assert(res.body.message === "Couldn’t process your request due to missing params inside the request")
            done()
        })
    })
})

//Getting the media of the instagram user test
describe("Get the media profile tests", () => {

    it("Get the media profile due to unknown user", done =>{
    
        let socialyticId = '5faec2f588ri4k5ju52cb0e9'
        let fbToken = 'EAAV2pKo9RUqdddZAGJXiE3XL4zisU6GQBw3xIWccqaN33b5V4QirZBCMsUAhfeij0sKKrXXgZDZD'
        let url = '/instagram/getmedia?fbToken='+fbToken+'&socialyticId='+socialyticId

        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

    it("Get the media profile due to empty fields", done =>{
        
        let socialyticId = '5faec2f588ri4k56552cb0e9'
        let fbToken = ''
        let url = '/instagram/getmedia?fbToken='+fbToken+'&socialyticId='+socialyticId

        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "Couldn’t process your request due to missing params inside the request")
            done()
        })
    })
})

//New followes graphic test
describe("New followers graphic tests", () => {

    it("New followers graphic Successfully", done =>{
        let register = {
            name: "Steve",
            lastName: "Rogers",
            password: "12345678910",
            email: "capi@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/signup').send(register).end((err, res) =>{
            let data = [
                {
                    value: 0,
                    end_time: "2020-11-01T07:00:00+0000"
                },
                {
                    value: 3,
                    end_time: "2020-11-02T08:00:00+0000"
                },
                {
                    value: 21,
                    end_time: "2020-11-03T08:00:00+0000"
                },
                {
                    value: 3,
                    end_time: "2020-11-04T08:00:00+0000"
                },
                {
                    value: 4,
                    end_time: "2020-11-05T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-06T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-07T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-08T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-09T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-10T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-11T08:00:00+0000"
                },
                {
                    value: 43,
                    end_time: "2020-11-12T08:00:00+0000"
                },
                {
                    value: 4,
                    end_time: "2020-11-13T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-14T08:00:00+0000"
                },
                {
                    value: 4,
                    end_time: "2020-11-15T08:00:00+0000"
                },
                {
                    value: 5,
                    end_time: "2020-11-16T08:00:00+0000"
                },
                {
                    value: 10,
                    end_time: "2020-11-17T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-18T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-19T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-20T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-21T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-22T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-23T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-24T08:00:00+0000"
                },
                {
                    value: 34,
                    end_time: "2020-11-25T08:00:00+0000"
                },
                {
                    value: 12,
                    end_time: "2020-11-26T08:00:00+0000"
                },
                {
                    value: 4,
                    end_time: "2020-11-27T08:00:00+0000"
                },
                {
                    value: 3,
                    end_time: "2020-11-28T08:00:00+0000"
                },
                {
                    value: 6,
                    end_time: "2020-11-29T08:00:00+0000"
                },
                {
                    value: 12,
                    end_time: "2020-11-30T08:00:00+0000"
                }
            ]

            let info = {
                socialyticId: res.body.id,
                data: data
            }
            
            request(app).post('/intstagram/newFollowers').send(info).end((err, res) =>{
                assert(res.body.message === "Successful follower description graphic")
                done()
            })
        })
    })

    it("New followers graphic due to unknown user", done =>{
        let info = {
            socialyticId: '5faec2f588ri4k56552cb0e9',
            fbToken: 'EAAV2pKo9RUqdddZAGJXiE3XL4zisU6GQBw3xIWccqaN33b5V4QirZBCMsUAhfeij0sKKrXXgZDZD'
        }

        request(app).post('/intstagram/newFollowers').send(info).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

    it("New followers graphic due to empty fields", done =>{
        let info = {
            socialyticId: '5faec2f588ri4k56552cb0e9',
            fbToken: ''
        }

        request(app).post('/intstagram/newFollowers').send(info).end((err, res) =>{
            assert(res.body.message === "Couldn’t process your request due to missing params inside the request")
            done()
        })
    })
})