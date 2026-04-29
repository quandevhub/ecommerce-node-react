export interface Product {
    id: number
    name: string
    description: string
    price: number
    stock: number
    image_url: string
}

export interface AuthResponse {
    message: string
    token: string
}

export interface LoginForm {
    email: string
    password_hash: string
}

export interface RegisterForm extends LoginForm {
    confirmPassword: string
}