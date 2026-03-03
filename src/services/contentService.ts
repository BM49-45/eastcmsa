// src/services/contentService.ts
'use server';

import clientPromise from '@/lib/mongodb';
import { Content, ContentDocument, CreateContentInput } from '@/types/content';
import { ObjectId } from 'mongodb';

// Export hizi functions zote
export async function getContent(): Promise<Content[]> {
  try {
    const client = await clientPromise;
    const db = client.db('eastcmsa');
    
    const contents = await db
      .collection<ContentDocument>('contents')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return contents.map((doc) => ({
      _id: doc._id.toString(),
      title: doc.title || '',
      category: doc.category || '',
      description: doc.description || '',
      views: doc.views || 0,
      likes: doc.likes || 0,
      downloads: doc.downloads || 0,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      fileType: doc.fileType,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));
  } catch (error) {
    console.error('Error fetching content:', error);
    return [];
  }
}

export async function deleteContent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const client = await clientPromise;
    const db = client.db('eastcmsa');
    
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid content ID' };
    }
    
    const result = await db.collection<ContentDocument>('contents').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 1) {
      return { success: true };
    } else {
      return { success: false, error: 'Content not found' };
    }
  } catch (error) {
    console.error('Error deleting content:', error);
    return { success: false, error: 'Failed to delete content' };
  }
}

export async function getSirahMetadata() {
  try {
    const client = await clientPromise;
    const db = client.db('eastcmsa');
    
    const sirahContents = await db
      .collection<ContentDocument>('contents')
      .find({ category: 'sirah' })
      .project({ title: 1, createdAt: 1, fileUrl: 1 })
      .toArray();
    
    return sirahContents.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      date: doc.createdAt,
      url: doc.fileUrl
    }));
  } catch (error) {
    console.error('Error fetching sirah metadata:', error);
    return [];
  }
}