const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index") //Se necesita invocar al servidor porque desde ahi es que se invocan las rutas

//Best day to post by profile views tests
describe("Best day to post by profile views", () => {
    
    it("Best day to post by profile views Successfully", done =>{
        let register = {
            name: "Edward",
            lastName: "Ocopio",
            password: "12345678910",
            email: "edward123@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/signup').send(register).end((err, res) =>{
            let data =[
                {
                    value: 2,
                    end_time: "2020-11-01T07:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-02T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-03T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-04T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-05T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-06T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-07T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-08T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-09T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-10T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-11T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-12T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-13T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-14T08:00:00+0000"
                },
                {
                    value: 8,
                    end_time: "2020-11-15T08:00:00+0000"
                },
                {
                    value: 5,
                    end_time: "2020-11-16T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-17T08:00:00+0000"
                },
                {
                    value: 0,
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
                    value: 2,
                    end_time: "2020-11-23T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-24T08:00:00+0000"
                },
                {
                    value: 2,
                    end_time: "2020-11-25T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-26T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-27T08:00:00+0000"
                },
                {
                    value: 1,
                    end_time: "2020-11-28T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-29T08:00:00+0000"
                },
                {
                    value: 0,
                    end_time: "2020-11-30T08:00:00+0000"
                }
            ]

            let info = {
                socialyticId: res.body.id,
                data: data
            }
        
            request(app).get('/prediction/bestdaybyviews').send(info).end((err, res) =>{
                assert(res.body.message === "Prediction successful")
                done()
            })
        })
    })

    it("Fail best day to post by profile views due to empty fields" , done =>{
        let data =[
            {
                value: 2,
                end_time: "2020-11-01T07:00:00+0000"
            },
            {
                value: 2,
                end_time: "2020-11-02T08:00:00+0000"
            },
            {
                value: 2,
                end_time: "2020-11-03T08:00:00+0000"
            },
            {
                value: 0,
                end_time: "2020-11-04T08:00:00+0000"
            },
            {
                value: 1,
                end_time: "2020-11-05T08:00:00+0000"
            },
            {
                value: 2,
                end_time: "2020-11-06T08:00:00+0000"
            },
            {
                value: 1,
                end_time: "2020-11-07T08:00:00+0000"
            },
            {
                value: 1,
                end_time: "2020-11-08T08:00:00+0000"
            },
            {
                value: 1,
                end_time: "2020-11-09T08:00:00+0000"
            },
            {
                value: 2,
                end_time: "2020-11-10T08:00:00+0000"
            }
        ]

        let info = {
            socialyticId: '',
            data: data
        }
    
        request(app).get('/prediction/bestdaybyviews').send(info).end((err, res) =>{
            assert(res.body.message === "This field is required")
            done()
        })
    })

    it("Fail best day to post by profile views due to unexist user", done =>{
        let info = {
            socialyticId: '5faec2f58a0772y6w52cb0e9',
            fbToken: 'EAAV2pKo9RUke1vWV3YvgkCMgDaEZAjgZBHqdSHdmOE3d1OFZCxJSFDjVzskkhNSYZANHyTiDFW43riox4nfF7jjdONMCn2rIPzk3FiZA6ZBwC9petZBlQZDZD'
        }
    
        request(app).get('/prediction/bestdaybyviews').send(info).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })
    
}) 