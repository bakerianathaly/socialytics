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


    it("Best day to post by engagements Successfully", done =>{
        let register = {
            name: "Goku",
            lastName: "cacaroto",
            password: "12345678910",
            email: "goku1@gmail.com",
            industry: "Influencer"
        }
        
        request(app).post('/signup').send(register).end((err, res) =>{
            
            let media = {
                "totalLikes": 221,
                "totalComments": 17,
                "avgLikes": "9.21",
                "avgComments": "0.71",
                "countMedia": 25,
                "mediaInfo": [
                    {
                        "caption": "Holi",
                        "comments_count": 1,
                        "like_count": 8,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/132170888_217390559959362_6066709970203035943_n.jpg?_nc_cat=111&ccb=2&_nc_sid=8ae9d6&_nc_ohc=YB9SbPoMwuEAX8Z788W&_nc_ht=scontent.cdninstagram.com&oh=176a8b34cc1dda4bcad75317d4b58f22&oe=600E27AC",
                        "timestamp": "2020-12-21T21:01:37+0000",
                        "id": "17864289935231673"
                    },
                    {
                        "caption": "Canción sad pal despecho",
                        "comments_count": 0,
                        "like_count": 2,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/126272955_690680088540977_468325408198630663_n.jpg?_nc_cat=108&ccb=2&_nc_sid=8ae9d6&_nc_ohc=10mA_x9zoJgAX-QHhRm&_nc_ht=scontent.cdninstagram.com&oh=9631cc95383d399af52e886db0ae8df6&oe=600F0B7A",
                        "timestamp": "2020-11-25T15:55:41+0000",
                        "id": "18034324525286351"
                    },
                    {
                        "caption": "Titi",
                        "comments_count": 0,
                        "like_count": 1,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/126121852_2755489051390962_3057261165333830718_n.jpg?_nc_cat=106&ccb=2&_nc_sid=8ae9d6&_nc_ohc=ffCvODZCXAgAX-TxY3k&_nc_ht=scontent.cdninstagram.com&oh=03977b7310fb877601929da1238a2b93&oe=600FCED8",
                        "timestamp": "2020-11-17T15:46:37+0000",
                        "id": "18174095983000043"
                    },
                    {
                        "caption": "Sad",
                        "comments_count": 0,
                        "like_count": 1,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/125547761_857750878331204_8758991756139947909_n.jpg?_nc_cat=111&ccb=2&_nc_sid=8ae9d6&_nc_ohc=qU9JnRtQ14AAX92ZCfS&_nc_ht=scontent.cdninstagram.com&oh=f818182250b4ed50e80b83d16d2df2a8&oe=600E37F5",
                        "timestamp": "2020-11-15T15:53:23+0000",
                        "id": "17933012251434673"
                    },
                    {
                        "caption": "#KiddosFatLife",
                        "comments_count": 6,
                        "like_count": 5,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/125235797_211378747020878_3794149802359569123_n.jpg?_nc_cat=108&ccb=2&_nc_sid=8ae9d6&_nc_ohc=Vk7QSJ0-zzAAX8f88KD&_nc_ht=scontent.cdninstagram.com&oh=7f7f1fc0b0bb50d8ae473d205d6975f1&oe=600FDD03",
                        "timestamp": "2020-11-15T15:52:04+0000",
                        "id": "17870178458056385"
                    }
                ]
            }

            let info = {
                socialyticId: res.body.id,
                media: media
            }
            request(app).post('/prediction/bestdaybyengagement').send(info).end((err, res) =>{
                assert(res.body.message === "Successful prediction")
                done()
            })
            
        })
    })
   
   
    
    it("Fail best day to post by engagements due to missing params in the request" , done =>{

        let media = {
            "totalLikes": 221,
            "totalComments": 17,
            "avgLikes": "9.21",
            "avgComments": "0.71",
            "countMedia": 25,
            "mediaInfo": [
                {
                    "caption": "Holi",
                    "comments_count": 1,
                    "like_count": 8,
                    "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/132170888_217390559959362_6066709970203035943_n.jpg?_nc_cat=111&ccb=2&_nc_sid=8ae9d6&_nc_ohc=YB9SbPoMwuEAX8Z788W&_nc_ht=scontent.cdninstagram.com&oh=176a8b34cc1dda4bcad75317d4b58f22&oe=600E27AC",
                    "timestamp": "2020-12-21T21:01:37+0000",
                    "id": "17864289935231673"
                }
            ]
        }
        let info = {
            socialyticId: '',
            media:''
        }

        request(app).post('/prediction/bestdaybyengagement').send(info).end((err, res) =>{
            assert(res.body.message === "Couldn’t process your request due to missing params inside it")
            done()
        })
    })

})

    