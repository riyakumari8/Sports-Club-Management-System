import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { sportsShopStaffService } from '../../services/sportsShopStaffService';
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Calendar,
  Package,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react';

export const SportsReportsPage = () => {
  const [report, setReport] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const [rep, rent] = await Promise.all([
          sportsShopStaffService.getSalesReport(),
          sportsShopStaffService.getEquipmentBookings(),
        ]);
        setReport(rep);
        setRentals(Array.isArray(rent) ? rent : []);
      } catch (err) {
        console.error('Failed to load sports reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  return (
    <DashboardLayout
      title="Sports Accessories Sales & Performance Reports"
      subtitle="Financial totals, equipment rental logs, and inventory turnover statistics"
    >
      {loading ? (
        <Loader message="Compiling sports shop performance data..." />
      ) : (
        <>
          {/* Revenue KPI Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Today's Revenue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F5132', marginTop: '4px' }}>
                ₹{Number(report?.todaySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {report?.todayOrders || 0} orders today
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>7-Day Revenue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
                ₹{Number(report?.weeklySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '2px' }}>
                <ArrowUpRight size={14} /> {report?.weeklyOrders || 0} orders this week
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>30-Day Revenue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
                ₹{Number(report?.monthlySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {report?.monthlyOrders || 0} orders this month
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>All-Time Revenue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                ₹{Number(report?.allTimeSales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {report?.allTimeOrders || 0} total sales completed
              </span>
            </div>
          </div>

          {/* Operational Metrics & Equipment Rentals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 1.2fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Operational Health */}
            <div className="cs-card">
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', marginBottom: '1.25rem' }}>
                Order Fulfilment Throughput
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#059669' }}></div>
                    <span style={{ fontWeight: 600 }}>Fulfilled / Completed</span>
                  </div>
                  <strong>{report?.completedOrders || 0} orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <span style={{ fontWeight: 600 }}>In Queue / Packing</span>
                  </div>
                  <strong>{report?.pendingOrders || 0} orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <span style={{ fontWeight: 600 }}>Low Stock SKUs</span>
                  </div>
                  <strong style={{ color: '#ef4444' }}>{report?.lowStockCount || 0} items</strong>
                </div>
              </div>
            </div>

            {/* Equipment Rentals Cross-Module View */}
            <div className="cs-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
                  Equipment Rentals & Court Demo Roster
                </h3>
                <span style={{ fontSize: '0.75rem', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '12px', fontWeight: 600 }}>
                  Court Ops Shared Feed
                </span>
              </div>

              <div className="cs-table-container">
                <table className="cs-table">
                  <thead>
                    <tr>
                      <th>Booking Ref</th>
                      <th>Customer</th>
                      <th>Equipment</th>
                      <th>Court & Slot</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rentals.map((r, i) => (
                      <tr key={i}>
                        <td><strong style={{ fontFamily: 'monospace' }}>{r.bookingId}</strong></td>
                        <td>{r.customerName}</td>
                        <td style={{ fontSize: '0.85rem' }}>{r.equipment}</td>
                        <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {r.court} &bull; {r.slot}
                        </td>
                        <td>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: r.status.includes('RETURNED') ? '#d1fae5' : '#fef3c7',
                            color: r.status.includes('RETURNED') ? '#065f46' : '#92400e',
                          }}>
                            {r.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SportsReportsPage;
