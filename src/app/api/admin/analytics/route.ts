// src/app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db('eastcmsa')

    // Get date range (last 30 days by default)
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Parallel queries for better performance
    const [
      totalAppDownloads,
      totalRegistrations,
      totalAudioPlays,
      totalShares,
      totalSubscribers,
      totalContent,
      viewsByCategory,
      recentActivity,
      topContent,
      dailyStats,
    ] = await Promise.all([
      // Total app downloads
      db.collection('activities').countDocuments({ action: 'download_app' }),

      // Total user registrations
      db.collection('users').countDocuments(),

      // Total audio plays
      db.collection('activities').countDocuments({ action: 'play_audio' }),

      // Total shares
      db.collection('activities').countDocuments({ action: 'share' }),

      // Total subscribers (users who subscribed to notifications)
      db.collection('users').countDocuments({ isSubscribed: true }),

      // Total content
      db.collection('contents').countDocuments(),

      // Views by category
      db
        .collection('activities')
        .aggregate([
          { $match: { action: 'play_audio', category: { $ne: null } } },
          { $group: { _id: '$category', views: { $sum: 1 } } },
        ])
        .toArray(),

      // Recent activities (last 20)
      db.collection('activities').find({}).sort({ timestamp: -1 }).limit(20).toArray(),

      // Top content by views
      db.collection('contents').find({}).sort({ views: -1 }).limit(5).toArray(),

      // Daily stats for chart
      db
        .collection('activities')
        .aggregate([
          { $match: { timestamp: { $gte: startDate } } },
          {
            $group: {
              _id: {
                date: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                action: '$action',
              },
              count: { $sum: 1 },
            },
          },
          {
            $group: {
              _id: '$_id.date',
              downloads: {
                $sum: { $cond: [{ $eq: ['$_id.action', 'download_app'] }, '$count', 0] },
              },
              registrations: {
                $sum: { $cond: [{ $eq: ['$_id.action', 'register'] }, '$count', 0] },
              },
              audioPlays: {
                $sum: { $cond: [{ $eq: ['$_id.action', 'play_audio'] }, '$count', 0] },
              },
              shares: { $sum: { $cond: [{ $eq: ['$_id.action', 'share'] }, '$count', 0] } },
            },
          },
          { $sort: { _id: 1 } },
        ])
        .toArray(),
    ])

    // Calculate users who downloaded, shared, and subscribed
    const usersWithDownloads = await db
      .collection('activities')
      .distinct('userId', { action: 'download_app' })
    const usersWithShares = await db
      .collection('activities')
      .distinct('userId', { action: 'share' })
    const subscribedUsers = await db.collection('users').distinct('_id', { isSubscribed: true })

    const subscribedUserIds = subscribedUsers.map((id) => id.toString())
    const usersWhoDidAll = usersWithDownloads.filter(
      (userId) => usersWithShares.includes(userId) && subscribedUserIds.includes(userId)
    ).length

    // Get top users by activity
    const topUsers = await db
      .collection('activities')
      .aggregate([
        {
          $group: {
            _id: '$userId',
            userName: { $first: '$userName' },
            userEmail: { $first: '$userEmail' },
            totalActions: { $sum: 1 },
            downloaded: { $max: { $cond: [{ $eq: ['$action', 'download_app'] }, 1, 0] } },
            shared: { $max: { $cond: [{ $eq: ['$action', 'share'] }, 1, 0] } },
            subscribed: { $max: { $cond: [{ $eq: ['$action', 'subscribe'] }, 1, 0] } },
          },
        },
        { $sort: { totalActions: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Format daily stats for the last 14 days
    const last14Days = Array.from({ length: 14 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (13 - i))
      const dateStr = date.toISOString().split('T')[0]
      const existing = dailyStats.find((d) => d._id === dateStr)
      return {
        date: dateStr,
        downloads: existing?.downloads || 0,
        registrations: existing?.registrations || 0,
        audioPlays: existing?.audioPlays || 0,
        shares: existing?.shares || 0,
      }
    })

    return NextResponse.json({
      totalAppDownloads,
      totalRegistrations,
      totalAudioPlays,
      totalShares,
      totalSubscribers,
      totalContent,
      usersWhoDidAll,
      viewsByCategory: viewsByCategory.map((v) => ({ category: v._id, views: v.views })),
      recentActivity: recentActivity.map((a) => ({
        id: a._id,
        userName: a.userName,
        action: a.action,
        timestamp: a.timestamp,
        contentTitle: a.contentTitle,
      })),
      topContent: topContent.map((c) => ({
        id: c._id,
        title: c.title,
        speaker: c.speaker,
        category: c.category,
        views: c.views || 0,
        downloads: c.downloads || 0,
      })),
      topUsers: topUsers.map((u) => ({
        userId: u._id,
        userName: u.userName || 'Mtumiaji',
        email: u.userEmail || '',
        downloaded: u.downloaded === 1,
        shared: u.shared === 1,
        subscribed: u.subscribed === 1,
        totalActions: u.totalActions,
      })),
      dailyStats: last14Days,
    })
  } catch (error) {
    console.error('Analytics API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
