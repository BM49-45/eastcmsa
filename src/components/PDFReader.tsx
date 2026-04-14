'use client'

import { useState, useEffect, useRef } from 'react'
import {
  X, Play, Pause, StopCircle, Volume2, VolumeX,
  SkipBack, SkipForward, Loader2, FileText, ChevronLeft, ChevronRight
} from 'lucide-react'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

interface PDFReaderProps {
  url: string
  title: string
  onClose: () => void
  language: 'arabic' | 'swahili' | 'english'
}

export default function PDFReader({ url, title, onClose, language }: PDFReaderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pageText, setPageText] = useState('')
  const [allText, setAllText] = useState<string[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  const pdfContainerRef = useRef<HTMLDivElement>(null)
  const speechSynthesisRef = useRef<typeof window.speechSynthesis | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      speechSynthesisRef.current = window.speechSynthesis
    }

    return () => {
      if (currentUtterance) {
        speechSynthesisRef.current?.cancel()
      }
    }
  }, [currentUtterance])

  // Load PDF and extract text
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setIsLoading(true)

        // Load PDF document
        const loadingTask = pdfjsLib.getDocument(url)
        const pdf = await loadingTask.promise
        setTotalPages(pdf.numPages)

        // Extract text from all pages
        const textContent: string[] = []
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const text = await page.getTextContent()
          const pageTextString = text.items.map((item: any) => item.str).join(' ')
          textContent.push(pageTextString)
        }

        setAllText(textContent)
        if (textContent.length > 0) {
          setPageText(textContent[0])
        }

        setIsLoading(false)
      } catch (error) {
        console.error('Error loading PDF:', error)
        setIsLoading(false)
      }
    }

    loadPDF()
  }, [url])

  // Update page text when page changes
  useEffect(() => {
    if (allText[currentPage - 1]) {
      setPageText(allText[currentPage - 1])
    }
  }, [currentPage, allText])

  // Speak current page text
  const speakPage = () => {
    if (!pageText || pageText.trim() === '') {
      alert('Hakuna maandishi ya kusoma kwenye ukurasa huu.')
      return
    }

    // Cancel any ongoing speech
    if (currentUtterance) {
      speechSynthesisRef.current?.cancel()
    }

    // Get language code
    let langCode = 'ar-SA' // Default Arabic
    if (language === 'swahili') langCode = 'sw-TZ'
    if (language === 'english') langCode = 'en-US'

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(pageText)
    utterance.lang = langCode
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
      setIsPaused(false)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      // Auto go to next page if available
      if (currentPage < totalPages) {
        setCurrentPage(prev => prev + 1)
      }
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
      setIsPaused(false)
      alert('Kumekuwa na tatizo katika kusoma kwa sauti.')
    }

    setCurrentUtterance(utterance)
    speechSynthesisRef.current?.speak(utterance)
  }

  // Stop speaking
  const stopSpeaking = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }

  // Pause speaking
  const pauseSpeaking = () => {
    if (speechSynthesisRef.current && isSpeaking) {
      speechSynthesisRef.current.pause()
      setIsPaused(true)
      setIsSpeaking(false)
    }
  }

  // Resume speaking
  const resumeSpeaking = () => {
    if (speechSynthesisRef.current && isPaused) {
      speechSynthesisRef.current.resume()
      setIsSpeaking(true)
      setIsPaused(false)
    }
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isSpeaking) {
      pauseSpeaking()
    } else if (isPaused) {
      resumeSpeaking()
    } else {
      speakPage()
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      stopSpeaking()
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      stopSpeaking()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
            title="Funga"
          >
            <X size={20} className="text-white" />
          </button>
          <FileText size={20} className="text-emerald-500" />
          <h2 className="text-white font-semibold">{title}</h2>
          <span className="text-gray-400 text-sm">
            Ukurasa {currentPage} wa {totalPages}
          </span>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
            title="Ukurasa uliopita"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading || !pageText}
            className="p-3 bg-emerald-600 hover:bg-emerald-700 rounded-full transition disabled:opacity-50"
            title={isSpeaking ? 'Simamisha' : isPaused ? 'Endelea' : 'Soma kwa Sauti'}
          >
            {isSpeaking ? (
              <Pause size={20} className="text-white" />
            ) : isPaused ? (
              <Play size={20} className="text-white" />
            ) : (
              <Volume2 size={20} className="text-white" />
            )}
          </button>

          <button
            onClick={stopSpeaking}
            disabled={!isSpeaking && !isPaused}
            className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
            title="Simamisha Kabisa"
          >
            <StopCircle size={20} className="text-white" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="p-2 hover:bg-gray-800 rounded-lg transition disabled:opacity-50"
            title="Ukurasa unaofuata"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        {/* PDF Viewer */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={40} className="text-emerald-500 animate-spin" />
              <p className="text-gray-400 ml-3">Inapakia kitabu...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Ukurasa {currentPage}
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {pageText || 'Hakuna maandishi ya kuonyesha kwenye ukurasa huu.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with page navigation */}
        <div className="w-64 bg-gray-900 border-l border-gray-800 p-4 overflow-y-auto">
          <h3 className="text-white font-semibold mb-3">Kurasa</h3>
          <div className="space-y-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => {
                  setCurrentPage(pageNum)
                  stopSpeaking()
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition ${currentPage === pageNum
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                Ukurasa {pageNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-3 bg-gray-900 border-t border-gray-800 text-center">
        <p className="text-xs text-gray-500">
          {isSpeaking && '🔊 Inasoma kwa sauti...'}
          {isPaused && '⏸ Imesimamishwa. Bonyeza play kuendelea.'}
          {!isSpeaking && !isPaused && !isLoading && '✅ Tayari kusoma. Bonyeza ikoni ya sauti kuanza.'}
        </p>
      </div>
    </div>
  )
}