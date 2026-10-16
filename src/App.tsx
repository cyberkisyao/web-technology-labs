import React, { useState, useEffect, useCallback } from 'react';
import { Book, UIState, Filters } from './types';
import { searchBooks } from './api/books';
import { Header } from './components/Header';
import { FiltersPanel } from './components/FiltersPanel';
import { BookList } from './components/BookList';

export function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [uiState, setUiState] = useState<UIState>('empty');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [filters, setFilters] = useState<Filters>({
    search: 'React',
    genre: '',
    onlyAvailable: false,
    sortBy: 'title-asc',
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('booknest_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Синхронизация вишлиста с localStorage
  useEffect(() => {
    localStorage.setItem('booknest_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const fetchBooks = useCallback(async (query: string, pageNum: number, signal: AbortSignal) => {
    if (!query || query.trim().length < 2) {
      setUiState('empty');
      setBooks([]);
      return;
    }

    setUiState('loading');

    try {
      const data = await searchBooks(query, pageNum, signal);
      
      if (!data.docs || data.docs.length === 0) {
        setUiState('empty');
        setBooks([]);
        return;
      }

      const formattedBooks: Book[] = data.docs.map((item: any, index: number) => ({
        id: item.key || String(index),
        title: item.title || 'Без названия',
        author: item.author_name ? item.author_name.join(', ') : 'Неизвестный автор',
        year: item.first_publish_year || 'Н/Д',
      }));

      if (filters.sortBy === 'title-asc') {
        formattedBooks.sort((a, b) => a.title.localeCompare(b.title));
      } else if (filters.sortBy === 'year-desc') {
        formattedBooks.sort((a, b) => Number(b.year) - Number(a.year));
      }

      setBooks(formattedBooks);
      setTotalPages(Math.ceil((data.num_found || 1) / 20));
      setUiState('success');
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Запрос был отменен, игнорируем
      }
      setErrorMessage(error instanceof Error ? error.message : 'Произошла ошибка загрузки');
      setUiState('error');
    }
  }, [filters.sortBy]);

  useEffect(() => {
    const controller = new AbortController();
    
    const timer = setTimeout(() => {
      fetchBooks(filters.search, page, controller.signal);
    }, 400); // Дебаунс 400мс

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [filters.search, page, fetchBooks]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // сброс на первую страницу при смене фильтров
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="app-container" style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <Header wishlistCount={wishlist.length} />

      <main style={{ padding: '2rem' }}>
        <h1>Каталог литературы BookNest</h1>
        
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearchSubmit={handleSearchSubmit}
        />

        <BookList
          uiState={uiState}
          books={books}
          errorMessage={errorMessage}
          wishlist={wishlist}
          onRetry={() => fetchBooks(filters.search, page, new AbortController().signal)}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Пагинация */}
        {uiState === 'success' && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              style={{ padding: '0.5rem 1rem', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
            >
              Назад
            </button>
            <span>Страница {page} из {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              style={{ padding: '0.5rem 1rem', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
            >
              Вперед
            </button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #ddd', color: '#666' }}>
        <p>&copy; 2026 библиотека BookNest (Lab 5 React).</p>
      </footer>
    </div>
  );
}

export default App;