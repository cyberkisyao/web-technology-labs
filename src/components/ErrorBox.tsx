import React from 'react';

interface ErrorBoxProps {
  message: string;
  onRetry: () => void;
}

export const ErrorBox: React.FC<ErrorBoxProps> = ({ message, onRetry }) => (
  <div style={{ textAlign: 'center', padding: '2rem', background: '#ffe6e6', borderRadius: '8px' }}>
    <p style={{ color: '#d9534f', fontWeight: 'bold', marginBottom: '1rem' }}>{message}</p>
    <button onClick={onRetry} className="card__button" style={{ backgroundColor: '#d9534f', color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
      Повторить запрос
    </button>
  </div>
);