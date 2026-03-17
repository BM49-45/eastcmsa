import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function POST(req:Request){

const {lectureId} = await req.json()

const client = await clientPromise
const db = client.db("eastcmsa")

await db.collection("lectures").updateOne(

{_id:new (require("mongodb")).ObjectId(lectureId)},

{$inc:{likes:1}}

)

return NextResponse.json({success:true})

}