import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = status.toUpperCase().replace(/\s+/g, '_');
  
  const getBadgeStyle = () => {
    switch (normalized) {
      // Inventory
      case 'IN_STOCK':
      case 'AVAILABLE':
      case 'ACTIVE':
      case 'COMPLETED':
      case 'DELIVERED':
      case 'SERVED':
        return { bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' };

      case 'LOW_STOCK':
      case 'PENDING':
      case 'PREPARING':
      case 'RESERVED':
        return { bg: '#fef9c3', color: '#a16207', border: '#fef08a' };

      case 'OUT_OF_STOCK':
      case 'OCCUPIED':
      case 'CANCELLED':
      case 'FAILED':
      case 'INACTIVE':
        return { bg: '#fee2e2', color: '#b91c1c', border: '#fecaca' };

      case 'CONFIRMED':
      case 'PROCESSING':
      case 'READY_FOR_PICKUP':
      case 'READY':
      case 'SHIPPED':
        return { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' };

      case 'CLEANING':
      case 'RETURN':
        return { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff' };

      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '600',
        backgroundColor: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
};

export default StatusBadge;
