import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export async function GET(req:Request){

const {searchParams} = new URL(req.url)

const q = searchParams.get("q")

const client = await clientPromise
const db = client.db("eastcmsa")

const results = await db.collection("lectures")
.find({
title:{$regex:q,$options:"i"}
})
.toArray()

return NextResponse.json(results)

}