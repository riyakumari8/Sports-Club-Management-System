import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { QrMembershipCard } from '../../components/cards/QrMembershipCard';
import { useAuth } from '../../context/AuthContext';
import { membershipService } from '../../services/membershipService';
import {
  CreditCard,
  QrCode,
  Sparkles,
  Calendar,
  ShieldCheck,
  ArrowRight,
  RotateCw,
  ShoppingBag,
  Coffee,
} from 'lucide-react';

export const MemberDashboard = () => {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const list = await membershipService.getMyMemberships();
        setMemberships(list);
        if (list.length > 0) {
          const card = await membershipService.getQrMembershipCard(list[0].id);
          setActiveCard(card);
        }
      } catch (err) {
        console.error('Failed to load member data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Member Portal" subtitle="Your ClubSphere membership hub">
        <Loader message="Loading your club membership details..." />
      </DashboardLayout>
    );
  }

  const activeMembership = memberships.find((m) => m.status === 'ACTIVE');

  return (
    <DashboardLayout
      title={`Welcome back, ${user?.fullName || 'Club Member'}!`}
      subtitle="Access your membership privileges, digital QR identity pass, and sports court access"
    >
      {/* Active Membership Status Banner */}
      {activeMembership ? (
        <div style={{
          background: 'linear-gradient(135deg, #072a18 0%, #0F5132 60%, #198754 100%)',
          borderRadius: '16px',
          padding: '2rem',
          color: '#ffffff',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          boxShadow: '0 10px 25px rgba(15, 81, 50, 0.25)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <ShieldCheck size={20} color="#4ade80" />
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.08em', fontWeight: 700, color: '#86efac' }}>
                Active Membership
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              {activeMembership.planName}
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem' }}>
              Membership Number: <strong style={{ color: '#ffffff', fontFamily: 'monospace' }}>{activeMembership.membershipNumber}</strong>
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', fontSize: '0.85rem' }}>
              <div>Valid From: <strong>{activeMembership.startDate}</strong></div>
              <div>Expiry Date: <strong style={{ color: '#fef08a' }}>{activeMembership.endDate}</strong></div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/member/qr-card" className="btn btn-gold btn-sm" style={{ padding: '0.7rem 1.25rem' }}>
              <QrCode size={18} /> View QR Card
            </Link>
            <Link to="/member/my-membership" className="btn btn-secondary btn-sm" style={{ padding: '0.7rem 1.25rem' }}>
              <RotateCw size={18} /> Renew Plan
            </Link>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fef3c7',
          borderRadius: '16px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
            No Active Membership Found
          </h3>
          <p style={{ color: '#b45309', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Choose a Gold, Silver, or Junior membership plan to activate court booking and club privileges.
          </p>
          <Link to="/member/plans" className="btn btn-primary">
            <Sparkles size={18} /> Browse Membership Plans
          </Link>
        </div>
      )}

      {/* Member Privileges and Shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Digital QR Gate Pass</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Contactless entry to courts and club</p>
            </div>
          </div>
          <Link to="/member/qr-card" style={{ fontSize: '0.85rem', color: '#0F5132', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            Open Pass <ArrowRight size={14} />
          </Link>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Pro Sports Shop</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Discounts automatically applied on gear</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
            {activeMembership?.planCategory === 'GOLD' ? '15% Discount Active' : activeMembership?.planCategory === 'SILVER' ? '10% Discount Active' : '5% Discount Active'}
          </span>
        </div>

        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: '#e0e7ff', color: '#3730a3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Coffee size={20} />
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#1f2937' }}>Cafe & Bar Lounge</h4>
              <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Complimentary access and dining perks</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
            {activeMembership?.planCategory === 'GOLD' ? '10% Discount Active' : activeMembership?.planCategory === 'SILVER' ? '5% Discount Active' : 'Standard Member Rates'}
          </span>
        </div>
      </div>

      {/* Digital QR Card Preview */}
      {activeCard && (
        <div className="cs-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.25rem' }}>
            Your Digital Membership Pass
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Present this card at the court entrance gate or scanning kiosk
          </p>
          <QrMembershipCard cardData={activeCard} />
        </div>
      )}
    </DashboardLayout>
  );
};
