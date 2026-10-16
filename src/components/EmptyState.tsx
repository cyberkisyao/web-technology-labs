import React from 'react';

export const EmptyState: React.FC = () => (
  <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
    <p>Введите поисковый запрос (минимум 2 символа) или ничего не найдено</p>
  </div>
);