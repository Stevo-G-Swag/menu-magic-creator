const API_BASE_URL = 'https://api.multion.ai'; // Replace with actual API URL

export const multiOnService = {
  async requestControl() {
    const response = await fetch(`${API_BASE_URL}/request-control`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to request control');
    return response.json();
  },

  async releaseControl() {
    const response = await fetch(`${API_BASE_URL}/release-control`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to release control');
    return response.json();
  },

  async getPageContent() {
    const response = await fetch(`${API_BASE_URL}/page-content`);
    if (!response.ok) throw new Error('Failed to get page content');
    return response.text();
  },

  async getAISuggestions(screenshot, pageContent) {
    const response = await fetch(`${API_BASE_URL}/ai-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ screenshot, pageContent }),
    });
    if (!response.ok) throw new Error('Failed to get AI suggestions');
    return response.json();
  },
};