'use client'

import { motion } from 'framer-motion'
import { 
  Headphones, Users, BookOpen, Globe, 
  TrendingUp, Clock, Download, Eye 
} from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  change: string
  color: string
  bgColor: string
}

const StatCard = ({ title, value, icon, change, color, bgColor }: StatCardProps) => (
  <motion.section
    whileHover={{ y: -5 }}
  >
    <div className={`${bgColor} p-6 rounded-2xl shadow-lg border`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-center text-sm">
        <TrendingUp size={16} className="mr-1" />
        <span>{change}</span>
      </div>
    </div>
  </motion.section>
)

export default function StatsDashboard() {
  const stats = [
    {
      title: 'Total Audio Plays',
      value: '2,847',
      icon: <Headphones size={24} />,
      change: '+12% this month',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Registered Users',
      value: '1,243',
      icon: <Users size={24} />,
      change: '+8% this month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Audio Hours',
      value: '156',
      icon: <Clock size={24} />,
      change: '+24 hours added',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Total Downloads',
      value: '5.2K',
      icon: <Download size={24} />,
      change: '+342 this week',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      title: 'Books Available',
      value: '24',
      icon: <BookOpen size={24} />,
      change: '+3 new books',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Countries Reached',
      value: '18',
      icon: <Globe size={24} />,
      change: '+2 new countries',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    }
  ]

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Eye className="mr-2 text-green-600" />
        Platform Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.section
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.section>
        ))}
      </div>
    </div>
  )
}