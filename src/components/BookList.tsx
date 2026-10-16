import React from 'react';
import { Book, UIState } from '../types';
import { Spinner } from './Spinner';
import { ErrorBox } from './ErrorBox';
import { EmptyState } from './EmptyState';
import { BookCard } from './BookCard';

interface BookListProps {
  uiState: UIState;
  books: Book[];
  errorMessage: string;
  wishlist: string[];
  onRetry: () => void;
  onToggleWishlist: (id: string) => void;
}

export const BookList: React.FC<BookListProps> = ({
  uiState,
  books,
  errorMessage,
  wishlist,
  onRetry,
  onToggleWishlist,
}) => {
  if (uiState === 'loading') return <Spinner />;
  if (uiState === 'error') return <ErrorBox message={errorMessage} onRetry={onRetry} />;
  if (uiState === 'empty' || books.length === 0) return <EmptyState />;

  return (
    <div className="catalog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          isWishlisted={wishlist.includes(book.id)}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
};