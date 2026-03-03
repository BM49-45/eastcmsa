import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ message: "Umetoka nje" })
  res.cookies.set("auth-session", "", { path: "/", maxAge: 0 })
  return res
}
