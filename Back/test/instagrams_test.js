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

//Frequency of the type of post test
describe("Frequency of the type of post tests", () => {

    it("Frequency of the type of post Successfully", done =>{
        let register = {
            name: "Ro",
            lastName: "Stark",
            password: "12345678910",
            email: "americaunida@gmail.com",
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
                        "media_type": "CAROUSEL_ALBUM",
                        "id": "17864289935231673"
                    },
                    {
                        "caption": "Canción sad pal despecho",
                        "comments_count": 0,
                        "like_count": 2,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/126272955_690680088540977_468325408198630663_n.jpg?_nc_cat=108&ccb=2&_nc_sid=8ae9d6&_nc_ohc=10mA_x9zoJgAX-QHhRm&_nc_ht=scontent.cdninstagram.com&oh=9631cc95383d399af52e886db0ae8df6&oe=600F0B7A",
                        "timestamp": "2020-11-25T15:55:41+0000",
                        "media_type": "IMAGE",
                        "id": "18034324525286351"
                    },
                    {
                        "caption": "Titi",
                        "comments_count": 0,
                        "like_count": 1,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/126121852_2755489051390962_3057261165333830718_n.jpg?_nc_cat=106&ccb=2&_nc_sid=8ae9d6&_nc_ohc=ffCvODZCXAgAX-TxY3k&_nc_ht=scontent.cdninstagram.com&oh=03977b7310fb877601929da1238a2b93&oe=600FCED8",
                        "timestamp": "2020-11-17T15:46:37+0000",
                        "media_type": "VIDEO",
                        "id": "18174095983000043"
                    },
                    {
                        "caption": "Sad",
                        "comments_count": 0,
                        "like_count": 1,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/125547761_857750878331204_8758991756139947909_n.jpg?_nc_cat=111&ccb=2&_nc_sid=8ae9d6&_nc_ohc=qU9JnRtQ14AAX92ZCfS&_nc_ht=scontent.cdninstagram.com&oh=f818182250b4ed50e80b83d16d2df2a8&oe=600E37F5",
                        "timestamp": "2020-11-15T15:53:23+0000",
                        "media_type": "IMAGE",
                        "id": "17933012251434673"
                    },
                    {
                        "caption": "#KiddosFatLife",
                        "comments_count": 6,
                        "like_count": 5,
                        "media_url": "https://scontent.cdninstagram.com/v/t51.29350-15/125235797_211378747020878_3794149802359569123_n.jpg?_nc_cat=108&ccb=2&_nc_sid=8ae9d6&_nc_ohc=Vk7QSJ0-zzAAX8f88KD&_nc_ht=scontent.cdninstagram.com&oh=7f7f1fc0b0bb50d8ae473d205d6975f1&oe=600FDD03",
                        "timestamp": "2020-11-15T15:52:04+0000",
                        "media_type": "VIDEO",
                        "id": "17870178458056385"
                    }
                ]
            }
            let info = {
                socialyticId: res.body.id,
                data: media
            }
            
            request(app).post('/instagram/typeMediaFrequency').send(info).end((err, res) =>{
                assert(res.body.message === "Frequency of your differents type of post")
                done()
            })
        })
    })

    it("Fail the frequency of the type of post test due to unknown user", done =>{
        let info = {
            socialyticId: '5fae4kf588ri4k56552cb0e9',
            media : 'aksdkmk'
        }

        request(app).post('/instagram/typeMediaFrequency').send(info).end((err, res) =>{
            assert(res.body.message === "This user doesn't exist, please try again")
            done()
        })
    })

    it("Fail the frequency of the type of post test due to empty fields", done =>{
        let info = {
            socialyticId: '5faec2f588ri4k56552cb0e9',
            media: ''
        }

        request(app).post('/instagram/typeMediaFrequency').send(info).end((err, res) =>{
            assert(res.body.message === "Couldn’t process your request due to missing params inside the request")
            done()
        })
    })
})