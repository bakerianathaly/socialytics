const assert = require("assert") //Para hacer la comparacion de booleans 
const request = require("supertest") //Nos permite hacer llamadas a nuestra propia api 
const app = require("../index")

describe("Prueba TDD", () => {
    //Aqui dentro van nuestras pequeñas pruebas, son con el metodo it("nombre de la prueba", done => {})

    it("Prueba GET request /", done =>{
        request(app).get('/').end((err,response) =>{
            assert(response.body.aux === "Hola mundo(?")
            done() //esto es para que si lo anterior se cumple, entonces se termina la prueba
            //El done tambien se usa para que las funciones asincronas terminen, esto es si no estamos retornando nada
        })
    })
}) //Lo que hace este metodo es agrupar las pruebas, por ejemplo se tiene describe("usuario"), describe("facturas")

