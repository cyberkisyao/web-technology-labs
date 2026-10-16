export function filterBooks(books, filters) {
  return books.filter(book => {
    const query = (filters.search || "").toLowerCase().trim();
    const matchesSearch = 
      !query || 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query);

    const matchesGenre = 
      !filters.genre || 
      filters.genre === "all" || 
      book.genre === filters.genre;

    const matchesAvailable = 
      !filters.onlyAvailable || 
      book.available === true;

    return matchesSearch && matchesGenre && matchesAvailable;
  });
}

export function sortBooks(books, sortBy) {
  const copy = [...books];

  switch (sortBy) {
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'year-desc':
      return copy.sort((a, b) => b.year - a.year);
    case 'rating-desc':
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
}