import { apiRequest } from './client';

export async function searchBooks(query: string, page = 1, signal?: AbortSignal) {
  return apiRequest('/search.json', { q: query, page, limit: 20 }, { signal });
}