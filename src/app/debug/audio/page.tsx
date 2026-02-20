'use client'

import { useState, useEffect } from 'react'

export default function AudioDebugPage() {
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [directFiles, setDirectFiles] = useState<string[]>([])

  const testApi = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/audio')
      const data = await response.json()
      setApiResponse(data)
    } catch (error) {
      if (error instanceof Error) {
        setApiResponse({ error: error.message })
      } else {
        setApiResponse({ error: 'Unknown error occurred' })
      }
    } finally {
      setLoading(false)
    }
  }

  const testDirectFiles = async () => {
    try {
      const response = await fetch(
        '/audio/tawhiid/01-al-usuul-athalatha-part-1.mp3',
        { method: 'HEAD' }
      )

      if (response.ok) {
        setDirectFiles(['File exists and is accessible'])
      } else {
        setDirectFiles([
          `Error: ${response.status} ${response.statusText}`,
        ])
      }
    } catch (error) {
      if (error instanceof Error) {
        setDirectFiles([`Error: ${error.message}`])
      } else {
        setDirectFiles(['Error: Unknown error occurred'])
      }
    }
  }

  useEffect(() => {
    testApi()
    testDirectFiles()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Audio System Debug</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Response */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">API Response</h2>

          <button
            onClick={testApi}
            disabled={loading}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API'}
          </button>

          {apiResponse && (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          )}
        </div>

        {/* Direct File Access */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Direct File Access</h2>

          <button
            onClick={testDirectFiles}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
          >
            Test File Access
          </button>

          <div className="space-y-2">
            {directFiles.map((file, index) => (
              <div
                key={index}
                className="p-3 bg-gray-100 dark:bg-gray-700 rounded"
              >
                {file}
              </div>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-2 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200">
          <h2 className="text-xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">
            Troubleshooting Steps
          </h2>

          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Check files:</strong>{' '}
              <code>public/audio/tawhiid/</code>
            </li>
            <li>
              <strong>Check metadata.json:</strong> valid JSON
            </li>
            <li>
              <strong>API:</strong>{' '}
              <a
                href="/api/audio"
                className="text-blue-500 underline"
                target="_blank"
              >
                /api/audio
              </a>
            </li>
            <li>
              <strong>Direct file:</strong>{' '}
              <a
                href="/audio/tawhiid/01-al-usuul-athalatha-part-1.mp3"
                className="text-blue-500 underline"
                target="_blank"
              >
                MP3 file
              </a>
            </li>
            <li>
              <strong>Console:</strong> F12 → Console
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}
