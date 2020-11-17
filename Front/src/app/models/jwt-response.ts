export interface JwtResponse {
    datos:{
        id:string,
        name: string,
        email: string,
        password: string,
        accessToken: string,
        expiresIn: string
    }
}
