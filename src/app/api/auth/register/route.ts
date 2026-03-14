import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(req:Request){

const {name,email,password} = await req.json()

const client = await clientPromise

const db = client.db("eastcmsa")

const existing = await db.collection("users").findOne({
 email:email.toLowerCase()
})

if(existing){

return NextResponse.json(
 {error:"Email already exists"},
 {status:400}
)

}

const hash = await bcrypt.hash(password,10)

await db.collection("users").insertOne({

name,
email:email.toLowerCase(),
password:hash,
role:"user",
createdAt:new Date()

})

return NextResponse.json({
success:true
})

}