import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("eastcmsa")
    const activities = db.collection("activities")
    const users = db.collection("users")
    const contents = db.collection("contents")

    const [totalViews, totalDownloads, totalUsers, totalContent] = await Promise.all([
      activities.countDocuments({ type: 'view' }),
      activities.countDocuments({ type: 'download' }),
      users.countDocuments(),
      contents.countDocuments()
    ])

    const viewsByCategory = await activities.aggregate([
      { $match: { type: 'view' } },
      { $group: { _id: { $ifNull: ['$category', 'general'] }, views: { $sum: 1 } } }
    ]).toArray()

    const recentActivity = await activities.aggregate([
      { $match: { timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } } } },
      { $sort: { "_id": 1 } }
    ]).toArray()

    const topContent = await activities.aggregate([
      { $match: { type: 'view' } },
      { $group: { _id: '$contentId', title: { $first: '$title' }, speaker: { $first: '$speaker' }, views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]).toArray()

    return NextResponse.json({
      totalViews,
      totalDownloads,
      totalUsers,
      totalContent,
      viewsGrowth: 0,
      downloadsGrowth: 0,
      usersGrowth: 0,
      contentGrowth: 0,
      viewsByCategory: viewsByCategory.map(v => ({ category: v._id, views: v.views, downloads: 0 })),
      recentActivity: recentActivity.map(r => ({ date: r._id, views: r.views, downloads: 0 })),
      topContent: topContent.map(t => ({ title: t.title, speaker: t.speaker, views: t.views, downloads: 0 }))
    })
  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}