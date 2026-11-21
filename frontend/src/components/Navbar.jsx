import React from 'react';
import { FaUserCircle, FaBell, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  return (
    <header
      style={{
        height: 'var(--navbar-height)',
        backgroundColor: 'white',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Active Module: <strong style={{ color: 'var(--primary-dark)' }}>Sports & Hospitality</strong>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link
          to="/customer/cart"
          className="btn btn-outline btn-sm"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FaShoppingCart color="var(--primary-color)" />
          <span>Cart</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaUserCircle size={28} color="var(--text-secondary)" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Balaji (Staff/Member)</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--primary-accent)', fontWeight: 600 }}>ADMIN ROLE</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
