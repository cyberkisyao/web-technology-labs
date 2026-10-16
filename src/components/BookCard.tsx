import React from 'react';
import { Book } from '../types';
import { Badge } from './Badge';

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onToggleWishlist: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="card" style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h3>{book.title}</h3>
      <p>Автор: {book.author}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Badge text={`Год: ${book.year}`} />
      </div>
      <button 
        onClick={() => onToggleWishlist(book.id)}
        style={{ marginTop: 'auto', padding: '0.5rem', background: isWishlisted ? '#d9534f' : '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isWishlisted ? 'Убрать из избранного' : 'В избранное ♥'}
      </button>
    </div>
  );
};