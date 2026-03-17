import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function POST(req:Request){

const {lectureId,text,user} = await req.json()

const client = await clientPromise
const db = client.db("eastcmsa")

await db.collection("comments").insertOne({

lectureId,
text,
user,
createdAt:new Date()

})

await db.collection("lectures").updateOne(

{_id:new (require("mongodb")).ObjectId(lectureId)},

{$inc:{comments:1}}

)

return NextResponse.json({success:true})

}