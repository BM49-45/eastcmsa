export interface User {
  _id?: string
  name: string
  email: string
  phone?: string
  password: string
  role: 'user' | 'admin' | 'moderator'
  emailVerified: boolean
  receiveUpdates: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  emailVerified: boolean
  receiveUpdates: boolean
  createdAt: Date
  updatedAt: Date
}