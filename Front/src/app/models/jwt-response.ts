export interface JwtResponse {
    datos:{
        id: number,
        name: string,
        email: string,
        accessToken: string,
        expiresIn: string
    }
}
