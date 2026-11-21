import React from 'react';
import { FaSearch } from 'react-icons/fa';

export const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: '340px',
      }}
    >
      <FaSearch
        style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-muted)',
          fontSize: '14px',
          pointerEvents: 'none',
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-control"
        style={{
          paddingLeft: '36px',
          height: '40px',
          fontSize: '0.9rem',
        }}
      />
    </div>
  );
};

export default SearchBar;
