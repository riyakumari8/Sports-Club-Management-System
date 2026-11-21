import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Loader } from '../../components/common/Loader';
import { QrMembershipCard } from '../../components/cards/QrMembershipCard';
import { membershipService } from '../../services/membershipService';
import { QrCode, Sparkles, ShieldCheck } from 'lucide-react';

export const QrMembershipCardPage = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const memberships = await membershipService.getMyMemberships();
        const active = memberships.find((m) => m.status === 'ACTIVE') || memberships[0];
        if (active) {
          const card = await membershipService.getQrMembershipCard(active.id);
          setCardData(card);
        }
      } catch (err) {
        console.error('Failed to load QR card', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCard();
  }, []);

  return (
    <DashboardLayout
      title="Digital QR Membership Pass"
      subtitle="Your verified digital credential for contactless entry into courts and clubhouse facilities"
    >
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        {loading ? (
          <Loader message="Generating secure cryptographic QR pass..." />
        ) : cardData ? (
          <div className="cs-card" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#d1e7dd',
                color: '#0F5132',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                marginBottom: '0.5rem'
              }}>
                <ShieldCheck size={16} /> VERIFIED ACTIVE IDENTITY PASS
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f2937' }}>
                Present at Gate or Kiosk Scanner
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                Scan to automatically unlock court turnstiles and verify booking reservations
              </p>
            </div>

            <QrMembershipCard cardData={cardData} />
          </div>
        ) : (
          <div className="cs-card" style={{ padding: '3rem 1.5rem' }}>
            <QrCode size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937', marginBottom: '0.5rem' }}>
              No Active Membership Card Available
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              A digital QR pass is generated automatically as soon as you subscribe to any ClubSphere membership plan.
            </p>
            <Link to="/member/plans" className="btn btn-primary">
              <Sparkles size={16} /> Browse Membership Plans
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
