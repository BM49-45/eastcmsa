import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"

export async function GET(req:Request,{params}:{params:{id:string}}){

const client = await clientPromise
const db = client.db("eastcmsa")

const lecture = await db.collection("lectures").findOne({
_id:new ObjectId(params.id)
})

await db.collection("lectures").updateOne(
{_id:new ObjectId(params.id)},
{$inc:{views:1}}
)

return NextResponse.json(lecture)

}