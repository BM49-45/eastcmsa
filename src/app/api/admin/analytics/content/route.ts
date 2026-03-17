import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const range = parseInt(searchParams.get('range') || '30')

    const client = await clientPromise
    const db = client.db('eastcmsa')

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - range)

    // Get overview stats
    const [
      totalUsers,
      totalLectures,
      totalViews,
      totalLikes,
      totalComments,
      totalDownloads,
      previousPeriodUsers,
      previousPeriodViews
    ] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('lectures').countDocuments(),
      db.collection('activities').countDocuments({ type: 'lecture_watch' }),
      db.collection('activities').countDocuments({ type: 'like' }),
      db.collection('comments').countDocuments(),
      db.collection('activities').countDocuments({ 
        type: { $in: ['lecture_download', 'book_download'] } 
      }),
      db.collection('users').countDocuments({
        createdAt: { $lt: startDate }
      }),
      db.collection('activities').countDocuments({
        type: 'lecture_watch',
        createdAt: { $lt: startDate }
      })
    ])

    // Calculate growth
    const userGrowth = previousPeriodUsers > 0 
      ? ((totalUsers - previousPeriodUsers) / previousPeriodUsers) * 100 
      : 0
    const viewGrowth = previousPeriodViews > 0
      ? ((totalViews - previousPeriodViews) / previousPeriodViews) * 100
      : 0

    // Get daily stats
    const dailyStats = await db.collection('activities').aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          users: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'register'] }, '$count', 0]
            }
          },
          views: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'lecture_watch'] }, '$count', 0]
            }
          },
          likes: {
            $sum: {
              $cond: [{ $eq: ['$_id.type', 'like'] }, '$count', 0]
            }
          }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: range }
    ]).toArray()

    // Get top content
    const topContent = await db.collection('lectures')
      .find({})
      .sort({ views: -1 })
      .limit(5)
      .project({ title: 1, views: 1, likes: 1, comments: 1 })
      .toArray()

    // Get category breakdown
    const categoryBreakdown = await db.collection('lectures').aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray()

    const response = {
      overview: {
        totalUsers,
        totalLectures,
        totalViews,
        totalLikes,
        totalComments,
        totalDownloads,
        userGrowth: Math.round(userGrowth * 10) / 10,
        viewGrowth: Math.round(viewGrowth * 10) / 10
      },
      dailyStats: dailyStats.map(d => ({
        date: d._id,
        users: d.users || 0,
        views: d.views || 0,
        likes: d.likes || 0
      })),
      topContent: topContent.map(c => ({
        ...c,
        type: 'lecture'
      })),
      categoryBreakdown: categoryBreakdown.map(c => ({
        name: c._id || 'Uncategorized',
        value: c.count
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}