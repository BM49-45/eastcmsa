// src/types/content.ts
import { ObjectId } from 'mongodb';

export interface ContentDocument {
  _id: ObjectId;
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Content {
  _id: string;
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateContentInput {
  title: string;
  category: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}