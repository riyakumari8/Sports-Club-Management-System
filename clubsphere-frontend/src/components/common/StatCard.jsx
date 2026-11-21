import React from 'react';

export const StatCard = ({ title, value, icon: Icon, color = '#0F5132', bg = '#d1e7dd', subtitle }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bg, color }}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-title">{title}</div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px' }}>{subtitle}</div>}
      </div>
    </div>
  );
};
