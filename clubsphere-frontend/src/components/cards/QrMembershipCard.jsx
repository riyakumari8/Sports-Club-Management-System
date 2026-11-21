import React, { useRef } from 'react';
import { Download, ShieldCheck, Award, Calendar, Phone, Droplet } from 'lucide-react';
import html2canvas from 'html2canvas';

export const QrMembershipCard = ({ cardData }) => {
  const cardRef = useRef(null);

  if (!cardData) return null;

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0F5132',
      });
      const link = document.createElement('a');
      link.download = `ClubSphere_${cardData.membershipNumber || 'Card'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate card image', err);
    }
  };

  const isGold = cardData.planCategory === 'GOLD';
  const isJunior = cardData.planCategory === 'JUNIOR';

  const cardGradient = isGold
    ? 'linear-gradient(135deg, #072a18 0%, #0F5132 50%, #b8860b 100%)'
    : isJunior
    ? 'linear-gradient(135deg, #0a2618 0%, #0369a1 100%)'
    : 'linear-gradient(135deg, #072a18 0%, #0F5132 70%, #475569 100%)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
      {/* Printable Card Node */}
      <div
        ref={cardRef}
        style={{
          width: '380px',
          height: '240px',
          borderRadius: '16px',
          background: cardGradient,
          color: '#ffffff',
          padding: '1.25rem',
          position: 'relative',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
          border: isGold ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid rgba(255, 255, 255, 0.15)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: isGold ? '#d4af37' : '#198754', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={14} color="#ffffff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                ClubSphere
              </span>
            </div>
            <span style={{ fontSize: '0.65rem', color: 'rgba(255, 255, 255, 0.75)', letterSpacing: '0.08em' }}>
              OFFICIAL MEMBERSHIP PASS
            </span>
          </div>

          <div style={{
            background: isGold ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.15)',
            border: isGold ? '1px solid #d4af37' : '1px solid rgba(255, 255, 255, 0.2)',
            padding: '3px 8px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: isGold ? '#fef08a' : '#ffffff'
          }}>
            {cardData.planName || cardData.planCategory}
          </div>
        </div>

        {/* Body (Name & QR) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>
          <div>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase' }}>MEMBER NAME</p>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.02em', margin: '2px 0 6px 0' }}>
              {cardData.memberName}
            </h4>
            <p style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255, 255, 255, 0.9)' }}>
              ID: {cardData.membershipNumber}
            </p>
          </div>

          {/* QR Code */}
          <div style={{
            background: '#ffffff',
            padding: '4px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
          }}>
            {cardData.qrCodeBase64 ? (
              <img
                src={cardData.qrCodeBase64}
                alt="Member QR Code"
                style={{ width: '82px', height: '82px', display: 'block' }}
              />
            ) : (
              <div style={{ width: '82px', height: '82px', background: '#e5e7eb' }} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.15)',
          paddingTop: '0.4rem',
          fontSize: '0.7rem',
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
          <div>
            VALID THRU: <strong style={{ color: '#ffffff' }}>{cardData.expiryDate || 'N/A'}</strong>
          </div>
          {cardData.bloodGroup && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Droplet size={11} color="#f87171" /> Blood: <strong>{cardData.bloodGroup}</strong>
            </div>
          )}
          <div style={{ textTransform: 'uppercase', color: cardData.status === 'ACTIVE' ? '#4ade80' : '#f87171', fontWeight: 700 }}>
            ● {cardData.status}
          </div>
        </div>
      </div>

      {/* Download Action */}
      <button onClick={downloadCard} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
        <Download size={16} /> Download QR Membership Card (PNG)
      </button>
    </div>
  );
};
