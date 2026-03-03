export interface Session {
  _id?: string
  sessionToken: string
  userId: string
  expires: Date
  createdAt: Date
}