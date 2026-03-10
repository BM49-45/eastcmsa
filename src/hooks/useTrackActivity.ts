'use client'

import { useActivity } from '@/context/ActivityContext'

export function useTrackActivity() {
  const { trackActivity } = useActivity()

  return {
    trackLectureWatch: (lectureId: string, lectureTitle: string) => {
      trackActivity('lecture_watch', lectureId, lectureTitle)
    },
    
    trackLectureDownload: (lectureId: string, lectureTitle: string) => {
      trackActivity('lecture_download', lectureId, lectureTitle)
    },
    
    trackBookRead: (bookId: string, bookTitle: string) => {
      trackActivity('book_read', bookId, bookTitle)
    },
    
    trackBookDownload: (bookId: string, bookTitle: string) => {
      trackActivity('book_download', bookId, bookTitle)
    },
    
    trackComment: (itemId: string, itemTitle: string, comment: string) => {
      trackActivity('comment', itemId, itemTitle, { comment })
    },
    
    trackLike: (itemId: string, itemTitle: string) => {
      trackActivity('like', itemId, itemTitle)
    },
    
    trackShare: (itemId: string, itemTitle: string) => {
      trackActivity('share', itemId, itemTitle)
    },
    
    trackLogin: () => {
      trackActivity('login')
    },
    
    trackRegister: () => {
      trackActivity('register')
    }
  }
}