export interface RegisterDataReq {
  name: string
  username: string
  email: string
  dateOfBirth: string
  gender: string
  password: string
  rePassword: string
}

export interface LoginDataReq {
  email: string
  password: string
}
export interface AuthResponse {
  success: boolean
  message: string
  data?: Data
  error?: string
}

export interface Data {
  token: string
  tokenType: string
  expiresIn: string
  user: User
}

export interface User {
  _id: string
  name: string
  username: string
  email: string
  photo: string
  cover: string
}

export interface ErrorResponse {
  success: boolean
  message: string
  errors: string
}

