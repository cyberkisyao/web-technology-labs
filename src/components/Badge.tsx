import React from 'react';

interface BadgeProps {
  text: string | number;
}

export const Badge: React.FC<BadgeProps> = ({ text }) => {
  return <span className="badge" style={{ padding: '0.2rem 0.5rem', background: '#eee', borderRadius: '4px', fontSize: '0.85rem' }}>{text}</span>;
};