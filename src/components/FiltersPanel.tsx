import React from 'react';
import { Filters, SortOption } from '../types';

interface FiltersPanelProps {
  filters: Filters;
  onFilterChange: (newFilters: Partial<Filters>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({
  filters,
  onFilterChange,
  onSearchSubmit,
}) => {
  return (
    <form onSubmit={onSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', margin: '1.5rem 0', alignItems: 'center' }}>
      <div style={{ flex: '1', minWidth: '250px' }}>
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          placeholder="Поиск книг по названию или автору..."
          style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div>
        <select
          value={filters.sortBy}
          onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
          style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="title-asc">По названию (А-Я)</option>
          <option value="year-desc">Сначала новые</option>
        </select>
      </div>

      <button type="submit" style={{ padding: '0.6rem 1.2rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Найти
      </button>
    </form>
  );
};