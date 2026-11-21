import React from 'react';

export const Badge = ({ type = 'active', children }) => {
  let badgeClass = 'badge-active';

  switch (type.toLowerCase()) {
    case 'active':
    case 'paid':
    case 'present':
    case 'approved':
      badgeClass = 'badge-active';
      break;
    case 'expired':
    case 'inactive':
    case 'terminated':
    case 'rejected':
    case 'absent':
      badgeClass = 'badge-expired';
      break;
    case 'pending':
    case 'pending_payment':
    case 'half_day':
      badgeClass = 'badge-pending';
      break;
    case 'gold':
      badgeClass = 'badge-gold';
      break;
    case 'silver':
      badgeClass = 'badge-silver';
      break;
    case 'junior':
      badgeClass = 'badge-junior';
      break;
    case 'on_leave':
      badgeClass = 'badge-leave';
      break;
    default:
      badgeClass = 'badge-active';
  }

  return <span className={`badge ${badgeClass}`}>{children || type}</span>;
};
