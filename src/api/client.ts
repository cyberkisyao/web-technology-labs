export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const BASE_URL = 'https://openlibrary.org';

export async function apiRequest(endpoint: string, params: Record<string, string | number | boolean> = {}, options: RequestInit = {}) {
  const url = new URL(endpoint, BASE_URL);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  try {
    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      if (response.status === 404 && endpoint.includes('search.json')) {
        return { docs: [], num_found: 0 };
      }
      let errorMessage = `Ошибка сервера: ${response.status}`;
      if (response.status === 404) errorMessage = 'Ресурс не найден (404)';
      else if (response.status >= 500) errorMessage = 'Ошибка на стороне сервера (5xx).';
      else if (response.status >= 400) errorMessage = 'Ошибка клиента (4xx). Проверьте запрос.';
      
      throw new ApiError(errorMessage, response.status);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new ApiError('Отсутствует подключение к интернету.', 0);
    }
    throw error;
  }
}