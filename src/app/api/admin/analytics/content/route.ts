import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { getAllAudioFiles } from "@/lib/r2"
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get('range') || 'week'

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

    // Get all audio files from R2
    const allAudio = await getAllAudioFiles()

    // Get real data from database
    const activities = db.collection('activities')
    const users = db.collection('users')
    const contents = db.collection('contents')

    // Current period stats
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
            _id: '$category',
            views: { $sum: 1 },
            downloads: { $sum: { $cond: [{ $eq: ['$type', 'download'] }, 1, 0] } }
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
            title: { $first: '$title' },
            speaker: { $first: '$speaker' },
            views: { $sum: { $cond: [{ $eq: ['$type', 'view'] }, 1, 0] } },
            downloads: { $sum: { $cond: [{ $eq: ['$type', 'download'] }, 1, 0] } }
          }
        },
        { $sort: { views: -1 } },
        { $limit: 10 }
      ]).toArray(),
      // Previous period views (for growth calculation)
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

    // Calculate growth percentages
    const viewsGrowth = previousViews > 0 
      ? ((currentViews - previousViews) / previousViews) * 100 
      : currentViews > 0 ? 100 : 0

    const downloadsGrowth = previousDownloads > 0 
      ? ((currentDownloads - previousDownloads) / previousDownloads) * 100 
      : currentDownloads > 0 ? 100 : 0

    // Format views by category
    const formattedViewsByCategory = viewsByCategory.map(item => ({
      category: item._id || 'general',
      views: item.views,
      downloads: item.downloads || 0
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
          title: item.title || 'Untitled',
          speaker: item.speaker || 'Unknown',
          views: item.views,
          downloads: item.downloads
        }))
      : allAudio
          .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 5)
          .map(audio => ({
            title: audio.title,
            speaker: audio.speaker,
            views: audio.views || 0,
            downloads: audio.downloads || 0
          }))

    return NextResponse.json({
      totalViews: currentViews,
      totalDownloads: currentDownloads,
      totalUsers,
      totalContent,
      viewsGrowth: Math.round(viewsGrowth * 10) / 10,
      downloadsGrowth: Math.round(downloadsGrowth * 10) / 10,
      usersGrowth: 0, // Calculate if needed
      contentGrowth: 0, // Calculate if needed
      viewsByCategory: formattedViewsByCategory,
      recentActivity: last7Days,
      topContent: formattedTopContent
    })

  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}