'use client'

import { useTheme } from '@/context/ThemeContext'
import { Moon, Sun, Laptop } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setTheme('light')}
        className={`p-2 rounded-md transition-all ${
          theme === 'light'
            ? 'bg-white dark:bg-gray-700 text-yellow-500 shadow-md'
            : 'text-gray-500 hover:text-yellow-500'
        }`}
        aria-label="Mwangaza"
        title="Mwangaza"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`p-2 rounded-md transition-all ${
          theme === 'dark'
            ? 'bg-white dark:bg-gray-700 text-blue-500 shadow-md'
            : 'text-gray-500 hover:text-blue-500'
        }`}
        aria-label="Giza"
        title="Giza"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`p-2 rounded-md transition-all ${
          theme === 'system'
            ? 'bg-white dark:bg-gray-700 text-purple-500 shadow-md'
            : 'text-gray-500 hover:text-purple-500'
        }`}
        aria-label="Mfumo"
        title="Mfumo"
      >
        <Laptop size={18} />
      </button>
    </div>
  )
}