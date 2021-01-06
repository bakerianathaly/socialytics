const assert = require("assert") //To make the boolean comparison
const request = require("supertest") //It allows us to make calls to our own api 
const app = require("../index") //The server needs to be invoked because that's where the paths are invoked

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
            let socialyticId = res.body.id
            let url = '/prediction/bestdaybyviews?socialyticId='+socialyticId+'&data='+data
        
            request(app).get(url.toString()).end((err, res) =>{
                assert(res.body.message === "Successful prediction")
                done()
            })
        })
    })

    it("Fail best day to post by profile views due to missing params in the request" , done =>{
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

        let socialyticId = ''
        let url = '/prediction/bestdaybyviews?socialyticId='+socialyticId+'&data='+data
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "Couldn't process your request due to missing params inside it")
            done()
        })
    })

    it("Fail best day to post by profile views due to unexistent user", done =>{
        
        let socialyticId = '5fa4c2f58a0772y6w52cb0e9'
        let fbToken = 'EAAV2pKo9RUke1vWV3YvgkCMgDaEZAjgZBHqdSHdmOE3d1OFZCxJSFDjVzskkhNSYZANHyTiDFW43riox4nfF7jjdONMCn2rIPzk3FiZA6ZBwC9petZBlQZDZD'
        let url = '/prediction/bestdaybyviews?socialyticId='+socialyticId+'&fbToken='+fbToken
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })
    
}) 

//Probable amount of Reach tests
describe("Probable amount of Reach per day of the week", () => {
    it("Best day to post by profile views Successfully", done =>{
        let register = {
            name: "Gianluigi",
            lastName: "Vincenzo",
            password: "12345678910",
            email: "vinchoncho@gmail.com",
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
            let socialyticId = res.body.id
            let url = '/prediction/probablereach?socialyticId='+socialyticId+'&data='+data
        
            request(app).get(url.toString()).end((err, res) =>{
                assert(res.body.message === "Successful prediction")
                done()
            })
        })
    })

    it("Fail best day to post by profile views due to missing params in the request" , done =>{
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

        let socialyticId = ''
        let url = '/prediction/probablereach?socialyticId='+socialyticId+'&data='+data
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "Couldn't process your request due to missing params inside it")
            done()
        })
    })

    it("Fail best day to post by profile views due to unexistent user", done =>{
        
        let socialyticId = '5fa4c2f58a0772y6w52cb0e9'
        let fbToken = 'EAAV2pKo9RUke1vWV3YvgkCMgDaEZAjgZBHqdSHdmOE3d1OFZCxJSFDjVzskkhNSYZANHyTiDFW43riox4nfF7jjdONMCn2rIPzk3FiZA6ZBwC9petZBlQZDZD'
        let url = '/prediction/probablereach?socialyticId='+socialyticId+'&fbToken='+fbToken
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })
})

// Test for best day to post by engagement

describe("Best day to post by engagement", () => {
   
    it("Best day to post by engagement Successfully", done =>{
        let register = {
            name: "goku",
            lastName: "cacaroto",
            password: "12345678910",
            email: "goku@gmail.com",
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
            let socialyticId = res.body.id
            let url = '/prediction/bestdaybyengagement?socialyticId='+socialyticId+'&data='+data
        
            request(app).get(url.toString()).end((err, res) =>{
                assert(res.body.message === "Successful prediction")
                done()
            })
        })
    })

    it("Fail best day to post by engagament due to missing params in the request" , done =>{
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

        let socialyticId = ''
        let url = '/prediction/bestdaybyengagement?socialyticId='+socialyticId+'&data='+data
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "Couldn't process your request due to missing params inside it")
            done()
        })
    })

    it("Fail best day to post by engagement due to unexistent user", done =>{
        
        let socialyticId = '5fa4c2f58a0772y6w52cb0e9'
        let fbToken = 'EAAV2pKo9RUke1vWV3YvgkCMgDaEZAjgZBHqdSHdmOE3d1OFZCxJSFDjVzskkhNSYZANHyTiDFW43riox4nfF7jjdONMCn2rIPzk3FiZA6ZBwC9petZBlQZDZD'
        let url = '/prediction/bestdaybyengagement?socialyticId='+socialyticId+'&fbToken='+fbToken
    
        request(app).get(url.toString()).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

})