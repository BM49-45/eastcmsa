import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { getAllAudioFiles } from "@/lib/r2"

export async function GET(req: NextRequest) {
  try {
    console.log("📊 Analytics API called")
    
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      console.log("❌ Unauthorized access to analytics")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || 'week'
    console.log("📊 Range selected:", range)

    const client = await clientPromise
    const db = client.db("eastcmsa")

    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    let previousStartDate = new Date()

    switch(range) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        previousStartDate.setDate(now.getDate() - 2)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        previousStartDate.setDate(now.getDate() - 14)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        previousStartDate.setMonth(now.getMonth() - 2)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        previousStartDate.setFullYear(now.getFullYear() - 2)
        break
      default:
        startDate.setDate(now.getDate() - 7)
        previousStartDate.setDate(now.getDate() - 14)
    }

    console.log("📊 Date range:", { startDate, previousStartDate })

    // Get collections
    const activities = db.collection('activities')
    const users = db.collection('users')
    const contents = db.collection('contents')

    // Check if collections exist and have data
    const activitiesCount = await activities.countDocuments()
    const usersCount = await users.countDocuments()
    const contentsCount = await contents.countDocuments()
    
    console.log("📊 Collection counts:", { activitiesCount, usersCount, contentsCount })

    // Get real data
    const [
      currentViews,
      currentDownloads,
      totalUsers,
      totalContent,
      viewsByCategory,
      recentActivity,
      topContent,
      previousViews,
      previousDownloads
    ] = await Promise.all([
      // Current views
      activities.countDocuments({
        type: 'view',
        timestamp: { $gte: startDate }
      }),
      // Current downloads
      activities.countDocuments({
        type: 'download',
        timestamp: { $gte: startDate }
      }),
      // Total users
      users.countDocuments(),
      // Total content
      contents.countDocuments(),
      // Views by category (current period)
      activities.aggregate([
        {
          $match: {
            type: 'view',
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: { $ifNull: ['$category', 'general'] },
            views: { $sum: 1 }
          }
        }
      ]).toArray(),
      // Recent activity (last 7 days)
      activities.aggregate([
        {
          $match: {
            timestamp: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
            }},
            views: {
              $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] }
            },
            downloads: {
              $sum: { $cond: [{ $eq: ['$type', 'download'] }, 1, 0] }
            }
          }
        },
        { $sort: { "_id.date": 1 } }
      ]).toArray(),
      // Top content
      activities.aggregate([
        {
          $match: {
            timestamp: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: '$contentId',
            title: { $first: { $ifNull: ['$title', 'Untitled'] } },
            speaker: { $first: { $ifNull: ['$speaker', 'Unknown'] } },
            views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } },
            downloads: { $sum: { $cond: [{ $eq: ['$type', 'download'] }, 1, 0] } }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]).toArray(),
      // Previous period views
      activities.countDocuments({
        type: 'view',
        timestamp: { $gte: previousStartDate, $lt: startDate }
      }),
      // Previous period downloads
      activities.countDocuments({
        type: 'download',
        timestamp: { $gte: previousStartDate, $lt: startDate }
      })
    ])

    console.log("📊 Data fetched:", { 
      currentViews, 
      currentDownloads, 
      totalUsers, 
      totalContent,
      viewsByCategory: viewsByCategory.length,
      recentActivity: recentActivity.length,
      topContent: topContent.length
    })

    // Calculate growth percentages
    const viewsGrowth = previousViews > 0 
      ? ((currentViews - previousViews) / previousViews) * 100 
      : currentViews > 0 ? 100 : 0

    const downloadsGrowth = previousDownloads > 0 
      ? ((currentDownloads - previousDownloads) / previousDownloads) * 100 
      : currentDownloads > 0 ? 100 : 0

    // Format views by category
    const formattedViewsByCategory = viewsByCategory.map(item => ({
      category: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      views: item.views,
      downloads: 0
    }))

    // If no data from database, use R2 data with zero counts
    if (formattedViewsByCategory.length === 0) {
      const categories = ['Tawhiid', 'Fiqh', 'Sirah', 'Mihadhara']
      categories.forEach(cat => {
        formattedViewsByCategory.push({
          category: cat,
          views: 0,
          downloads: 0
        })
      })
    }

    // Format recent activity
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const existing = recentActivity.find((a: any) => a._id.date === dateStr)
      last7Days.push({
        date: dateStr,
        views: existing?.views || 0,
        downloads: existing?.downloads || 0
      })
    }

    // Format top content
    const formattedTopContent = topContent.length > 0 
      ? topContent.map(item => ({
          title: item.title,
          speaker: item.speaker,
          views: item.views,
          downloads: item.downloads
        }))
      : []

    const response = {
      totalViews: currentViews,
      totalDownloads: currentDownloads,
      totalUsers,
      totalContent,
      viewsGrowth: Math.round(viewsGrowth * 10) / 10,
      downloadsGrowth: Math.round(downloadsGrowth * 10) / 10,
      usersGrowth: 0,
      contentGrowth: 0,
      viewsByCategory: formattedViewsByCategory,
      recentActivity: last7Days,
      topContent: formattedTopContent
    }

    console.log("📊 Sending response:", response)
    return NextResponse.json(response)

  } catch (error) {
    console.error("❌ Analytics API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 }
    )
  }
}