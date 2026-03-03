// src/services/contentService.client.ts
'use client';

import { Content } from '@/types/content';

// Client-side functions - zitaita API
export async function fetchContent(): Promise<Content[]> {
  const response = await fetch('/api/content');
  if (!response.ok) throw new Error('Failed to fetch content');
  return response.json();
}

export async function deleteContentClient(id: string): Promise<{ success: boolean; error?: string }> {
  const response = await fetch(`/api/content/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}

export async function fetchSirahMetadata() {
  const response = await fetch('/api/sirah');
  if (!response.ok) throw new Error('Failed to fetch sirah metadata');
  return response.json();
}