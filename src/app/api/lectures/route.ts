import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(){

const client = await clientPromise
const db = client.db("eastcmsa")

const lectures = await db.collection("lectures")
.find({})
.sort({createdAt:-1})
.toArray()

return NextResponse.json(lectures)

}

export async function POST(req:Request){

const data = await req.json()

const client = await clientPromise
const db = client.db("eastcmsa")

const result = await db.collection("lectures").insertOne({

title:data.title,
category:data.category,
teacher:data.teacher,
description:data.description,
audioUrl:data.audioUrl,
views:0,
likes:0,
comments:0,
createdAt:new Date()

})

return NextResponse.json(result)

}