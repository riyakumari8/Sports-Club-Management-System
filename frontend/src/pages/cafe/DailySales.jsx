import React, { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt, FaUtensils, FaMoneyBillWave, FaDownload } from 'react-icons/fa';
import cafeApi from '../../api/cafeApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const DailySales = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailySales(selectedDate);
  }, [selectedDate]);

  const fetchDailySales = async (date) => {
    setLoading(true);
    try {
      const res = await cafeApi.getDailySales(date);
      setSalesData(res.data);
    } catch (err) {
      console.error(err);
      // Fallback empty data if no sales recorded yet for date
      setSalesData({
        date,
        totalSales: 0,
        orderCount: 0,
        dineInCount: 0,
        takeawayCount: 0,
        popularItems: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Calculating Daily Cafe Sales..." />;

  const total = Number(salesData?.totalSales || 0);
  const count = salesData?.orderCount || 0;
  const avgTicket = count > 0 ? (total / count).toFixed(2) : 0;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaChartLine style={{ color: 'var(--primary-accent)' }} /> Cafe & Bar Daily Sales
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Daily revenue analytics, order counts, and popular refreshment rankings.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaCalendarAlt style={{ color: 'var(--text-secondary)' }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="form-control"
            style={{ width: '180px' }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-accent)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Daily Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-accent)', marginTop: '4px' }}>
            ₹{total.toFixed(2)}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--primary-color)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Orders Fulfilled</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)', marginTop: '4px' }}>
            {count}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Average Order Value</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
            ₹{avgTicket}
          </div>
        </div>

        <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--warning-color)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Dine-In vs Takeaway</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '8px' }}>
            {salesData?.dineInCount || 0} Dine / {salesData?.takeawayCount || 0} Takeaway
          </div>
        </div>
      </div>

      {/* Popular Items Table */}
      <div className="card" style={{ padding: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 16px 0', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          Most Popular Dishes & Drinks on {new Date(selectedDate).toLocaleDateString()}
        </h2>

        {(!salesData?.popularItems || salesData.popularItems.length === 0) ? (
          <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No dish sales records found for this date.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Menu Item</th>
                  <th>Units Sold</th>
                  <th>Total Revenue Generated</th>
                </tr>
              </thead>
              <tbody>
                {salesData.popularItems.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: idx === 0 ? 'var(--warning-color)' : 'var(--text-secondary)' }}>
                      #{idx + 1}
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.itemName}</td>
                    <td style={{ fontWeight: 700 }}>{item.quantitySold} orders</td>
                    <td style={{ fontWeight: 700, color: 'var(--primary-accent)' }}>
                      ₹{Number(item.revenue || 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySales;
