import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Bell } from 'lucide-react';

export const Navbar = ({ title, subtitle }) => {
  const { user } = useAuth();

  const getPrimaryRole = () => {
    if (user?.roles?.includes('ROLE_ADMIN')) return 'Admin';
    if (user?.roles?.includes('ROLE_STAFF')) return 'Staff';
    if (user?.roles?.includes('ROLE_MEMBER')) return 'Member';
    return 'User';
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length > 1 ? parts[0][0] + parts[1][0] : name[0];
  };

  return (
    <header className="top-navbar">
      <div className="navbar-page-title">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <div className="navbar-user-actions">
        <div className="user-badge">
          <div className="user-avatar">
            {getInitials(user?.fullName)}
          </div>
          <div className="user-info">
            <div className="name">{user?.fullName || 'User'}</div>
            <div className="role-tag">{getPrimaryRole()}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
