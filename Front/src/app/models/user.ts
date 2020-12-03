export interface User {
    id: string,
    name: string,
    lastName: string,
    email: string,
    password: string,
    industry: string
    accessToken?: string,
    expiresIn?: string
}
