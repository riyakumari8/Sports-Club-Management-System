import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { foodShopStaffService } from '../../services/foodShopStaffService';
import {
  Coffee,
  DollarSign,
  Clock,
  CheckCircle,
  Timer,
  TrendingUp,
  Flame,
  Award,
} from 'lucide-react';

export const FoodReportsPage = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [prepReport, setPrepReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [sales, prep] = await Promise.all([
          foodShopStaffService.getSalesReport(),
          foodShopStaffService.getPreparationTimesReport(),
        ]);
        setSalesReport(sales);
        setPrepReport(prep);
      } catch (err) {
        console.error('Failed to load cafe reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <DashboardLayout
      title="Cafe Sales & Kitchen Prep-Time Throughput Reports"
      subtitle="Financial performance, kitchen cooking speeds, on-time delivery rates, and dining analytics"
    >
      {loading ? (
        <Loader message="Compiling cafe analytics..." />
      ) : (
        <>
          {/* Revenue KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>Today's Cafe Sales</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0F5132', marginTop: '4px' }}>
                ₹{Number(salesReport?.todaySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {salesReport?.todayOrders || 0} kitchen orders today
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>7-Day Cafe Sales</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
                ₹{Number(salesReport?.weeklySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#059669' }}>
                {salesReport?.weeklyOrders || 0} orders this week
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>30-Day Cafe Sales</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1f2937', marginTop: '4px' }}>
                ₹{Number(salesReport?.monthlySales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {salesReport?.monthlyOrders || 0} monthly orders
              </span>
            </div>

            <div className="cs-card">
              <span style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase' }}>All-Time Revenue</span>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                ₹{Number(salesReport?.allTimeSales || 0).toLocaleString()}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {salesReport?.allTimeOrders || 0} orders served
              </span>
            </div>
          </div>

          {/* Kitchen Throughput & Preparation Speed Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Kitchen Speed */}
            <div className="cs-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Timer size={22} color="#0F5132" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
                  Kitchen Speed & SLA Target
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>Avg Prep Time</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F5132' }}>
                    {prepReport?.averagePrepMinutes || 12} min
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#059669' }}>
                    Target: &le; {prepReport?.targetPrepMinutes || 15} min
                  </span>
                </div>

                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase' }}>On-Time Rate</span>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669' }}>
                    {prepReport?.onTimePercentage || 94.2}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {prepReport?.ordersMeasured || 1} orders tracked
                  </span>
                </div>
              </div>

              <div style={{ background: '#fef3c7', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: '#92400e' }}>
                <strong>Peak Ordering Hours:</strong> {prepReport?.peakOrderingHour || '12:00 PM - 02:00 PM & 06:00 PM - 08:00 PM'}
              </div>
            </div>

            {/* Kitchen Status Distribution */}
            <div className="cs-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Flame size={22} color="#0F5132" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937' }}>
                  Active Kitchen Stations
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Ready to Serve:</span>
                  <strong style={{ color: '#059669' }}>{salesReport?.readyOrders || 0} orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Currently on Grill / Preparing:</span>
                  <strong style={{ color: '#d97706' }}>{salesReport?.preparingOrders || 0} orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Pending in Kitchen Queue:</span>
                  <strong style={{ color: '#dc2626' }}>{salesReport?.pendingOrders || 0} orders</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ fontWeight: 600 }}>Table Seating Occupancy:</span>
                  <strong>{salesReport?.occupiedTables || 0} / {Number(salesReport?.occupiedTables || 0) + Number(salesReport?.availableTables || 0)} Tables</strong>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default FoodReportsPage;
