/**
 * BhoomiDrishti AI - Centralized Client Configuration & API Utility
 * Supports seamless deployment across Vercel (All-in-one / Serverless) and Localhost.
 */

// Clear any stale local overrides from previous sessions
try {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('bhoomidrishti_api_url');
  }
} catch (_) {}

/**
 * Resolve the active API base URL:
 * 1. Vite environment variable: VITE_API_URL (if explicitly provided)
 * 2. On localhost / 127.0.0.1: http://127.0.0.1:8000
 * 3. In production (Vercel): '' (empty string for same-origin relative paths e.g. /api/records)
 */
export const getActiveApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // In production browser (e.g. *.vercel.app), use relative path so requests hit same-origin /api
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return '';
  }

  return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = getActiveApiUrl();

/**
 * Format a clean absolute or relative API endpoint URL
 * @param {string} path e.g. '/api/records' or 'api/records'
 */
export const getApiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const base = getActiveApiUrl();
  return base ? `${base}${cleanPath}` : cleanPath;
};

/**
 * Resilient fetch wrapper with retry handling
 */
export const apiFetch = async (endpoint, options = {}, retries = 1) => {
  const url = endpoint.startsWith('http') ? endpoint : getApiUrl(endpoint);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (err) {
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        throw err;
      }
    }
  }
};
