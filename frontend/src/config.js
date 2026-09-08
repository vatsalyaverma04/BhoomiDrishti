/**
 * BhoomiDrishti AI - Centralized Client Configuration & API Utility
 * Supports seamless deployment across Vercel (Frontend), Render (Backend), and Localhost.
 */

// Retrieve any runtime user-configured override from LocalStorage
const getStoredApiUrl = () => {
  try {
    return localStorage.getItem('bhoomidrishti_api_url') || '';
  } catch {
    return '';
  }
};

// Resolve the active API base URL in order of priority:
// 1. Custom runtime override set in UI (localStorage)
// 2. Vite environment variable (VITE_API_URL set in Vercel / .env)
// 3. Fallback to http://127.0.0.1:8000 for local development
export const getActiveApiUrl = () => {
  const stored = getStoredApiUrl();
  if (stored && stored.trim()) {
    return stored.trim().replace(/\/+$/, '');
  }

  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // If in browser and not localhost, but no VITE_API_URL was set, default to same origin if applicable
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Return empty for relative path /api proxy or default fallback
    return '';
  }

  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getActiveApiUrl();

/**
 * Format a clean absolute API endpoint URL
 * @param {string} path e.g. '/api/records' or 'api/records'
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getActiveApiUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
};

/**
 * Set a custom API URL override in LocalStorage
 */
export const setCustomApiUrl = (url) => {
  try {
    if (!url || !url.trim()) {
      localStorage.removeItem('bhoomidrishti_api_url');
    } else {
      localStorage.setItem('bhoomidrishti_api_url', url.trim().replace(/\/+$/, ''));
    }
  } catch (e) {
    console.warn('Could not save API URL to localStorage:', e);
  }
};

/**
 * Resilient fetch wrapper with cold-start timeout handling for Render free tier
 */
export const apiFetch = async (endpoint, options = {}, retries = 1) => {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      if (attempt < retries) {
        // Wait 1.5s before retrying (helpful for waking up Render instances)
        await new Promise((res) => setTimeout(res, 1500));
      } else {
        throw err;
      }
    }
  }
};
