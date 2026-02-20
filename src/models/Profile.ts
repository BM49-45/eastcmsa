export interface Profile {
  _id?: string
  userId: string
  bio: string
  avatar?: string
  location?: string
  interests?: string[]
  createdAt: Date
  updatedAt: Date
}