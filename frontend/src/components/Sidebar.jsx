import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaShoppingBag,
  FaBoxes,
  FaShoppingCart,
  FaUtensils,
  FaChevronDown,
  FaChevronRight,
  FaChartLine,
  FaList,
  FaPlusCircle,
  FaExclamationTriangle,
  FaCashRegister,
  FaReceipt,
  FaTable,
  FaConciergeBell,
} from 'react-icons/fa';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const [openSections, setOpenSections] = useState({
    shop: true,
    inventory: true,
    ecommerce: true,
    cafe: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const navLinkStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '9px 16px',
    borderRadius: 'var(--radius-sm)',
    color: isActive ? 'white' : '#cbd5e1',
    backgroundColor: isActive ? 'var(--primary-color)' : 'transparent',
    textDecoration: 'none',
    fontSize: '0.88rem',
    fontWeight: isActive ? 600 : 400,
    transition: 'all 0.15s ease',
    marginBottom: '2px',
  });

  return (
    <>
      <div
        className={`mobile-overlay ${isMobileOpen ? 'active' : ''}`}
        onClick={onCloseMobile}
      />
      <aside className={`sidebar-aside ${isMobileOpen ? 'mobile-open' : ''}`}>
      {/* Brand Header */}
      <div
        style={{
          padding: '20px 20px',
          borderBottom: '1px solid #1f2937',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'var(--primary-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '18px',
          }}
        >
          CS
        </div>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'white', letterSpacing: '-0.3px' }}>
            ClubSphere
          </h2>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Sports Management
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {/* SECTION 1: SPORTS SHOP */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => toggleSection('shop')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaShoppingBag /> Sports Shop
            </span>
            {openSections.shop ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </button>
          {openSections.shop && (
            <div style={{ marginTop: '4px', paddingLeft: '6px' }}>
              <NavLink to="/shop/dashboard" style={navLinkStyle}>
                <FaChartLine size={13} /> Dashboard
              </NavLink>
              <NavLink to="/shop/products" style={navLinkStyle}>
                <FaList size={13} /> Catalogue
              </NavLink>
              <NavLink to="/shop/products/add" style={navLinkStyle}>
                <FaPlusCircle size={13} /> Add Product
              </NavLink>
              <NavLink to="/shop/categories" style={navLinkStyle}>
                <FaBoxes size={13} /> Categories
              </NavLink>
            </div>
          )}
        </div>

        {/* SECTION 2: INVENTORY */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => toggleSection('inventory')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBoxes /> Inventory
            </span>
            {openSections.inventory ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </button>
          {openSections.inventory && (
            <div style={{ marginTop: '4px', paddingLeft: '6px' }}>
              <NavLink to="/inventory/dashboard" style={navLinkStyle}>
                <FaChartLine size={13} /> Overview
              </NavLink>
              <NavLink to="/inventory/stock" style={navLinkStyle}>
                <FaList size={13} /> Stock Levels
              </NavLink>
              <NavLink to="/inventory/stock-in" style={navLinkStyle}>
                <FaPlusCircle size={13} /> Stock In
              </NavLink>
              <NavLink to="/inventory/adjust" style={navLinkStyle}>
                <FaBoxes size={13} /> Adjust Stock
              </NavLink>
              <NavLink to="/inventory/movements" style={navLinkStyle}>
                <FaList size={13} /> Movement Log
              </NavLink>
              <NavLink to="/inventory/low-stock" style={navLinkStyle}>
                <FaExclamationTriangle size={13} /> Low Stock Alerts
              </NavLink>
            </div>
          )}
        </div>

        {/* SECTION 3: E-COMMERCE & POS */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => toggleSection('ecommerce')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaShoppingCart /> E-Commerce & POS
            </span>
            {openSections.ecommerce ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </button>
          {openSections.ecommerce && (
            <div style={{ marginTop: '4px', paddingLeft: '6px' }}>
              <NavLink to="/customer/shop" style={navLinkStyle}>
                <FaShoppingBag size={13} /> Online Store
              </NavLink>
              <NavLink to="/customer/cart" style={navLinkStyle}>
                <FaShoppingCart size={13} /> Shopping Cart
              </NavLink>
              <NavLink to="/customer/orders" style={navLinkStyle}>
                <FaReceipt size={13} /> My Orders
              </NavLink>
              <NavLink to="/admin/orders" style={navLinkStyle}>
                <FaList size={13} /> Admin Orders
              </NavLink>
              <NavLink to="/shop/counter-sales" style={navLinkStyle}>
                <FaCashRegister size={13} /> Counter POS
              </NavLink>
            </div>
          )}
        </div>

        {/* SECTION 4: CAFE & BAR */}
        <div style={{ marginBottom: '16px' }}>
          <button
            onClick={() => toggleSection('cafe')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              fontSize: '0.76rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              padding: '6px 8px',
              cursor: 'pointer',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUtensils /> Cafe & Bar
            </span>
            {openSections.cafe ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
          </button>
          {openSections.cafe && (
            <div style={{ marginTop: '4px', paddingLeft: '6px' }}>
              <NavLink to="/cafe/dashboard" style={navLinkStyle}>
                <FaChartLine size={13} /> Cafe Dashboard
              </NavLink>
              <NavLink to="/cafe/menu" style={navLinkStyle}>
                <FaList size={13} /> Customer Menu
              </NavLink>
              <NavLink to="/cafe/menu/manage" style={navLinkStyle}>
                <FaPlusCircle size={13} /> Manage Menu
              </NavLink>
              <NavLink to="/cafe/tables" style={navLinkStyle}>
                <FaTable size={13} /> Tables Grid
              </NavLink>
              <NavLink to="/cafe/orders/place" style={navLinkStyle}>
                <FaPlusCircle size={13} /> Place Order
              </NavLink>
              <NavLink to="/cafe/kitchen" style={navLinkStyle}>
                <FaConciergeBell size={13} /> Kitchen Display
              </NavLink>
              <NavLink to="/cafe/orders" style={navLinkStyle}>
                <FaList size={13} /> All Cafe Orders
              </NavLink>
              <NavLink to="/cafe/tabs" style={navLinkStyle}>
                <FaReceipt size={13} /> Customer Tabs
              </NavLink>
              <NavLink to="/cafe/sales" style={navLinkStyle}>
                <FaChartLine size={13} /> Daily Sales
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      {/* Footer Info */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid #1f2937', fontSize: '0.78rem', color: '#64748b' }}>
        ClubSphere v1.0 • Academic
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
