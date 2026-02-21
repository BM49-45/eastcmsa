const API_BASE = '/api/content';

export const contentService = {
  async getAllContent() {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  },

  async deleteContent(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete');
    return res.json();
  },

  // Add other methods as needed
};