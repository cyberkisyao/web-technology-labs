import { initialBooks } from './data/books.js';
import { filterBooks, sortBooks } from './lib/books.js';
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
  books: initialBooks,
  filteredBooks: initialBooks,
  wishlist: loadFromStorage('booknest_wishlist', []),
  filters: loadFromStorage('booknest_filters', {
    search: '',
    genre: 'all',
    onlyAvailable: false,
    sortBy: 'title-asc'
  })
};

function updateDerivedData() {
  const filtered = filterBooks(state.books, state.filters);
  state.filteredBooks = sortBooks(filtered, state.filters.sortBy);
}

function init() {
  updateDerivedData();
  render(state);

  const filterForm = document.querySelector('#filter-form');
  if (filterForm) {
    filterForm.addEventListener('input', (e) => {
      e.preventDefault();
      
      state.filters.search = document.querySelector('#search-input')?.value || '';
      state.filters.genre = document.querySelector('#genre-select')?.value || 'all';
      state.filters.onlyAvailable = document.querySelector('#available-checkbox')?.checked || false;
      state.filters.sortBy = document.querySelector('#sort-select')?.value || 'title-asc';

      saveToStorage('booknest_filters', state.filters);
      updateDerivedData();
      render(state);
    });

    filterForm.addEventListener('submit', (e) => e.preventDefault());
  }

  const resetBtn = document.querySelector('#reset-filters-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state.filters = {
        search: '',
        genre: 'all',
        onlyAvailable: false,
        sortBy: 'title-asc'
      };
      saveToStorage('booknest_filters', state.filters);
      updateDerivedData();
      render(state);
    });
  }

  document.addEventListener('click', (e) => {
    const wishlistBtn = e.target.closest('.wishlist-toggle');
    if (wishlistBtn) {
      const card = wishlistBtn.closest('.card');
      const bookId = Number(card?.dataset.id);
      
      if (bookId) {
        const index = state.wishlist.indexOf(bookId);
        if (index > -1) {
          state.wishlist.splice(index, 1);
        } else {
          state.wishlist.push(bookId);
        }
        saveToStorage('booknest_wishlist', state.wishlist);
        render(state);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', init);