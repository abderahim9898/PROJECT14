// API configuration for both local and production environments
export const API_BASE_URL = 
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5173' // Local development
    : 'https://e28869f130e048bfa7964a6fa385e03c-98b60eba61274d2092aac3f86.fly.dev'; // Production (Fly.io backend)

export function apiUrl(path: string): string {
  // If the path already includes a protocol, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}
