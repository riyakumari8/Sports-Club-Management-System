import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaTable, FaConciergeBell, FaReceipt, FaChartLine, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

const CafeDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dailySales, setDailySales] = useState(null);

  useEffect(() => {
    loadCafeData();
  }, []);

  const loadCafeData = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const [tableRes, orderRes, menuRes, salesRes] = await Promise.all([
        cafeApi.getAllTables(),
        cafeApi.getAllOrders(),
        cafeApi.getAllMenuItems(),
        cafeApi.getDailySales(today).catch(() => ({ data: { totalSales: 0, orderCount: 0 } })),
      ]);

      setTables(tableRes.data || []);
      const orders = orderRes.data || [];
      setActiveOrders(orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED'));
      setMenuItems(menuRes.data || []);
      setDailySales(salesRes.data || { totalSales: 0, orderCount: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading Cafe & Bar Operations..." />;

  const occupiedTables = tables.filter((t) => t.status === 'OCCUPIED').length;
  const availableTables = tables.filter((t) => t.status === 'AVAILABLE').length;

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0 }}>Cafe & Bar Management</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Table occupancy, kitchen order display, dine-in POS, customer tabs, and split billing.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/cafe/orders/place" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaPlus /> New Cafe Order
          </Link>
          <Link to="/cafe/kitchen" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <FaConciergeBell /> Kitchen Display (KDS)
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaTable />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Tables Seating</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {occupiedTables} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 400 }}>/ {tables.length} Occupied</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--warning-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#fffbeb', color: 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaClock />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Kitchen Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--warning-color)' }}>{activeOrders.length}</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--primary-accent)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#e8f5e9', color: 'var(--primary-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaUtensils />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Menu Offerings</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700 }}>{menuItems.length} items</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '4px solid var(--success-color)' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#f0fdf4', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
            <FaChartLine />
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Today's Cafe Revenue</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--success-color)' }}>
              ₹{Number(dailySales?.totalSales || 0).toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Live Tables Preview + Active Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Table Status Snapshot */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Restaurant Seating Snapshot</h2>
            <Link to="/cafe/tables" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Table Grid &rarr;
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '12px' }}>
            {tables.map((t) => {
              const isOccupied = t.status === 'OCCUPIED';
              const isReserved = t.status === 'RESERVED';
              const isCleaning = t.status === 'CLEANING';
              return (
                <div
                  key={t.id}
                  style={{
                    padding: '12px 8px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: isOccupied ? '#fee2e2' : isReserved ? '#fef3c7' : isCleaning ? '#f1f5f9' : '#e8f5e9',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                    T-{t.tableNumber}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '2px 0' }}>
                    {t.capacity} Seats
                  </div>
                  <div style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: isOccupied ? '#991b1b' : isReserved ? '#92400e' : isCleaning ? '#475569' : '#166534',
                    textTransform: 'uppercase',
                  }}>
                    {t.status}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Active Kitchen Orders */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Active Kitchen Orders</h2>
            <Link to="/cafe/kitchen" style={{ color: 'var(--primary-color)', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
              Open KDS &rarr;
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                No pending kitchen orders right now. Kitchen is clear!
              </div>
            ) : (
              activeOrders.slice(0, 5).map((o) => (
                <div
                  key={o.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#f8fafc',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.92rem' }}>Order #{o.orderNumber || o.id}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {o.orderType === 'DINE_IN' ? `Table ${o.tableNumber}` : 'Takeaway'} • {o.items?.length || 1} items
                    </div>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CafeDashboard;
