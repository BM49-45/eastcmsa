import clientPromise from "@/lib/mongodb"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function GET(){

const client = await clientPromise
const db = client.db("eastcmsa")

const users = await db.collection("users").countDocuments()

const lectures = await db.collection("lectures").countDocuments()

const views = await db.collection("lectures")
.aggregate([
{$group:{_id:null,total:{$sum:"$views"}}}
]).toArray()

const likes = await db.collection("lectures")
.aggregate([
{$group:{_id:null,total:{$sum:"$likes"}}}
]).toArray()

return NextResponse.json({

users,
lectures,
views:views[0]?.total || 0,
likes:likes[0]?.total || 0

})

}