import { searchBooks } from './api/books.js';
import { render } from './ui/render.js';

function loadFromStorage(key, defaultValue) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Ошибка чтения ${key} из localStorage:`, e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Ошибка записи ${key} в localStorage:`, e);
  }
}

const state = {
  books: [],
  filteredBooks: [],
  uiState: 'empty', 
  errorMessage: '',
  page: 1,
  totalFound: 0,
  wishlist: loadFromStorage('booknest_wishlist', []),
  filters: loadFromStorage('booknest_filters', {
    search: '',
    genre: 'all',
    onlyAvailable: false,
    sortBy: 'title-asc'
  })
};

let currentAbortController = null;
let debounceTimer = null;

const searchInput = document.getElementById('search-input');
const genreSelect = document.getElementById('genre-select');
const sortSelect = document.getElementById('sort-select');
const availableCheckbox = document.getElementById('available-checkbox');
const resetBtn = document.getElementById('reset-filters-btn');
const booksCountElement = document.getElementById('books-count');
const catalogGrid = document.querySelector('.catalog-grid');
const wishlistCounter = document.getElementById('wishlist-counter');

async function fetchBooksData(query, page = 1) {
  if (!query || query.trim().length < 2) {
    state.books = [];
    state.filteredBooks = [];
    state.uiState = 'empty';
    updateView();
    return;
  }

  if (currentAbortController) {
    currentAbortController.abort();
  }
  currentAbortController = new AbortController();

  state.uiState = 'loading';
  updateView();

  try {
    const result = await searchBooks(query, page, currentAbortController.signal);
    
    const formattedBooks = result.docs.map((doc, index) => ({
      id: doc.key || index,
      title: doc.title,
      author: doc.author_name ? doc.author_name.join(', ') : 'Не указан',
      genre: 'Фантастика', // заглушка для фильтра по жанру, если в ответе нет точного жанра
      available: true,
      year: doc.first_publish_year || 2020,
      rating: 4.5
    }));

    state.books = formattedBooks;
    state.totalFound = result.numFound;
    
    applyFiltersAndSort();

    if (state.filteredBooks.length === 0) {
      state.uiState = 'empty';
    } else {
      state.uiState = 'success';
    }

    updateView();

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Запрос отменен пользователем/новым вводом');
      return;
    }

    state.uiState = 'error';
    state.errorMessage = error.message || 'Ошибка загрузки данных с сервера.';
    updateView();
  }
}

function applyFiltersAndSort() {
  let result = [...state.books];

  if (state.filters.genre !== 'all') {
    result = result.filter(book => book.genre === state.filters.genre);
  }

  if (state.filters.onlyAvailable) {
    result = result.filter(book => book.available);
  }

  result.sort((a, b) => {
    if (state.filters.sortBy === 'title-asc') {
      return a.title.localeCompare(b.title);
    } else if (state.filters.sortBy === 'year-desc') {
      return (b.year || 0) - (a.year || 0);
    } else if (state.filters.sortBy === 'rating-desc') {
      return (b.rating || 0) - (a.rating || 0);
    }
    return 0;
  });

  state.filteredBooks = result;
  if (booksCountElement) {
    booksCountElement.textContent = `Найдено книг: ${state.totalFound} (показано: ${result.length})`;
  }
}

function updateView() {
  if (!catalogGrid) return;

  catalogGrid.innerHTML = '';

  if (wishlistCounter) {
    wishlistCounter.textContent = state.wishlist.length;
  }

  if (state.uiState === 'loading') {
    catalogGrid.innerHTML = '<li style="grid-column: 1/-1; text-align: center; padding: 2rem;">🔄 Загрузка данных из Open Library...</li>';
    return;
  }

  if (state.uiState === 'error') {
    catalogGrid.innerHTML = `
      <li style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #d9534f;">
        <p><strong>${state.errorMessage}</strong></p>
        <button id="retry-btn" class="card__button" style="margin-top: 1rem; padding: 0.5rem 1rem;">Повторить</button>
      </li>
    `;
    document.getElementById('retry-btn')?.addEventListener('click', () => {
      fetchBooksData(state.filters.search, state.page);
    });
    return;
  }

  if (state.uiState === 'empty' || state.filteredBooks.length === 0) {
    catalogGrid.innerHTML = '<li style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #666;">📚 Введите поисковый запрос (от 2 символов) или ничего не найдено.</li>';
    return;
  }

  render(state);
}

function init() {
  if (searchInput) searchInput.value = state.filters.search;
  if (genreSelect) genreSelect.value = state.filters.genre;
  if (sortSelect) sortSelect.value = state.filters.sortBy;
  if (availableCheckbox) availableCheckbox.checked = state.filters.onlyAvailable;

  if (state.filters.search) {
    fetchBooksData(state.filters.search, state.page);
  } else {
    state.uiState = 'empty';
    updateView();
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      state.filters.search = query;
      state.page = 1;

      saveToStorage('booknest_filters', state.filters);
      clearTimeout(debounceTimer);

      debounceTimer = setTimeout(() => {
        fetchBooksData(query, state.page);
      }, 350);
    });
  }

  const handleFilterChange = () => {
    state.filters.genre = genreSelect?.value || 'all';
    state.filters.onlyAvailable = availableCheckbox?.checked || false;
    state.filters.sortBy = sortSelect?.value || 'title-asc';

    saveToStorage('booknest_filters', state.filters);
    applyFiltersAndSort();
    
    if (state.books.length > 0) {
      state.uiState = 'success';
      updateView();
    }
  };

  genreSelect?.addEventListener('change', handleFilterChange);
  sortSelect?.addEventListener('change', handleFilterChange);
  availableCheckbox?.addEventListener('change', handleFilterChange);

  resetBtn?.addEventListener('click', () => {
    state.filters = { search: '', genre: 'all', onlyAvailable: false, sortBy: 'title-asc' };
    state.page = 1;
    if (searchInput) searchInput.value = '';
    if (genreSelect) genreSelect.value = 'all';
    if (sortSelect) sortSelect.value = 'title-asc';
    if (availableCheckbox) availableCheckbox.checked = false;

    saveToStorage('booknest_filters', state.filters);
    state.uiState = 'empty';
    updateView();
  });

  document.addEventListener('click', (e) => {
    const wishlistBtn = e.target.closest('.wishlist-toggle');
    if (wishlistBtn) {
      const card = wishlistBtn.closest('.card');
      const bookId = card?.dataset.id;
      
      if (bookId) {
        const index = state.wishlist.indexOf(bookId);
        if (index > -1) {
          state.wishlist.splice(index, 1);
        } else {
          state.wishlist.push(bookId);
        }
        saveToStorage('booknest_wishlist', state.wishlist);
        updateView();
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);