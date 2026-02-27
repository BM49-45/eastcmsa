// src/types/content.ts
export interface Content {
  _id: string;
  title: string;
  category?: string;
  description?: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt?: Date;
  updatedAt?: Date;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ContentData {
  title: string;
  category: string;
  description?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}