export interface Book {
  id: string;
  title: string;
  author: string;
  year: number | string;
  genre?: string;
  available?: boolean;
}

export type UIState = 'loading' | 'success' | 'empty' | 'error';

export type SortOption = 'title-asc' | 'year-desc' | 'rating-desc';

export interface Filters {
  search: string;
  genre: string;
  onlyAvailable: boolean;
  sortBy: SortOption;
}