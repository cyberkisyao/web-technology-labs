import React from 'react';
import { Badge } from './Badge';

interface HeaderProps {
  wishlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({ wishlistCount }) => {
  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #ddd' }}>
      <div className="header__logo">
        <strong>BookNest (React)</strong>
      </div>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '1.5rem', margin: 0, alignItems: 'center' }}>
          <li><a href="#catalog" style={{ textDecoration: 'none', color: '#333' }}>Каталог</a></li>
          <li>
            <a href="#wishlist" style={{ textDecoration: 'none', color: '#333', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              Избранное
              <Badge text={wishlistCount} />
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};