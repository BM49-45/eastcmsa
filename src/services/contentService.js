// src/services/contentService.js
// This file should NOT import mongodb.ts

const API_BASE = '/api';

export async function getContent() {
  try {
    const res = await fetch(`${API_BASE}/content`);
    if (!res.ok) {
      throw new Error('Failed to fetch content');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export async function createContent(data) {
  try {
    const res = await fetch(`${API_BASE}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to create content');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating content:', error);
    throw error;
  }
}

export async function deleteContent(id) {
  try {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      throw new Error('Failed to delete content');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error deleting content:', error);
    throw error;
  }
}

export async function updateContent(id, data) {
  try {
    const res = await fetch(`${API_BASE}/content/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update content');
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}

export async function getSirahMetadata() {
  try {
    const res = await fetch(`${API_BASE}/sirah/metadata`);
    if (!res.ok) {
      throw new Error('Failed to fetch sirah metadata');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching sirah metadata:', error);
    throw error;
  }
}