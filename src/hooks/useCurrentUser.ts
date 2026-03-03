import { useState, useEffect } from "react"

export interface User {
  _id: string
  name: string
  email: string
  role: string
  createdAt?: string
  updatedAt?: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true)
        const res = await fetch("/api/auth/me")
        const data = await res.json()

        if (!res.ok) {
          setError(data.error || "Hitilafu katika kupata data")
          setUser(null)
        } else {
          setUser(data.user)
        }
      } catch (err: any) {
        setError(err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
