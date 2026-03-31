'use client'

import { useAnalytics } from './useAnalytics'

export function useTrackActivity() {
  const { trackAudioPlay, trackShare } = useAnalytics()

  return {
    trackLectureWatch: (lectureId: string, lectureTitle: string) => {
      trackAudioPlay(lectureId, lectureTitle, 'lecture')
    },
    
    trackLectureDownload: (lectureId: string, lectureTitle: string) => {
      // Can add download tracking if needed
      console.log('Lecture download:', lectureId, lectureTitle)
    },
    
    trackBookRead: (bookId: string, bookTitle: string) => {
      trackAudioPlay(bookId, bookTitle, 'book')
    },
    
    trackBookDownload: (bookId: string, bookTitle: string) => {
      console.log('Book download:', bookId, bookTitle)
    },
    
    trackComment: (itemId: string, itemTitle: string, comment: string) => {
      console.log('Comment:', itemId, itemTitle, comment)
    },
    
    trackLike: (itemId: string, itemTitle: string) => {
      console.log('Like:', itemId, itemTitle)
    },
    
    trackShare: (itemId: string, itemTitle: string) => {
      trackShare(itemId, itemTitle)
    },
    
    trackLogin: () => {
      // Handled by useAnalytics automatically
    },
    
    trackRegister: () => {
      // Handled by useAnalytics automatically
    }
  }
}