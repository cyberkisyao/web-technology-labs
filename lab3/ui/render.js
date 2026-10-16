export function render(state) {
  const catalogContainer = document.querySelector('.catalog-grid');
  if (catalogContainer) {
    catalogContainer.innerHTML = '';

    if (state.filteredBooks.length === 0) {
      const li = document.createElement('li');
      li.className = 'card';
      
      const title = document.createElement('h2');
      title.className = 'card__title';
      title.textContent = 'Книги не найдены';

      const desc = document.createElement('p');
      desc.className = 'card__description';
      desc.textContent = 'Попробуйте изменить параметры поиска или сбросить фильтры.';

      li.append(title, desc);
      catalogContainer.appendChild(li);
    } else {
      state.filteredBooks.forEach((book, index) => {
        const isWishlisted = state.wishlist.includes(book.id);

        const li = document.createElement('li');
        li.className = 'card';
        li.dataset.id = book.id;

        const img = document.createElement('img');
        img.src = `images/book${(index % 3) + 1}.jpg`;
        img.alt = `Обложка книги ${book.title}`;
        img.className = 'card__image';

        const title = document.createElement('h2');
        title.className = 'card__title';
        title.textContent = book.title;

        const desc = document.createElement('p');
        desc.className = 'card__description';
        desc.textContent = `${book.author} (${book.year}) — Жанр: ${book.genre}. Рейтинг: ${book.rating}`;

        const status = document.createElement('p');
        status.className = 'card__status';
        status.textContent = book.available ? 'В наличии' : 'Нет на складе';

        const btn = document.createElement('button');
        btn.className = 'card__button wishlist-toggle';
        btn.type = 'button';
        btn.textContent = isWishlisted ? 'В списке желаемого' : 'Хочу прочитать';
        btn.setAttribute('aria-pressed', isWishlisted ? 'true' : 'false');

        li.append(img, title, desc, status, btn);
        catalogContainer.appendChild(li);
      });
    }
  }

  const countEl = document.querySelector('#books-count');
  if (countEl) {
    countEl.textContent = `Найдено книг: ${state.filteredBooks.length}`;
  }

  const wishlistCountEl = document.querySelector('#wishlist-counter');
  if (wishlistCountEl) {
    wishlistCountEl.textContent = state.wishlist.length;
  }

  // Синхронизация элементов формы
  const searchInput = document.querySelector('#search-input');
  if (searchInput && searchInput.value !== state.filters.search) {
    searchInput.value = state.filters.search;
  }

  const genreSelect = document.querySelector('#genre-select');
  if (genreSelect && genreSelect.value !== state.filters.genre) {
    genreSelect.value = state.filters.genre;
  }

  const availableCheckbox = document.querySelector('#available-checkbox');
  if (availableCheckbox && availableCheckbox.checked !== state.filters.onlyAvailable) {
    availableCheckbox.checked = state.filters.onlyAvailable;
  }

  const sortSelect = document.querySelector('#sort-select');
  if (sortSelect && sortSelect.value !== state.filters.sortBy) {
    sortSelect.value = state.filters.sortBy;
  }
}