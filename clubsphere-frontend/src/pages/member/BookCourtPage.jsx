import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { courtService } from '../../services/courtService';
import { membershipService } from '../../services/membershipService';
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  User,
  CreditCard,
  Sparkles,
  QrCode,
  MapPin,
  Users,
} from 'lucide-react';

export const BookCourtPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [courts, setCourts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('ALL');
  const [selectedCourtId, setSelectedCourtId] = useState(searchParams.get('courtId') || '');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  // Member tier details
  const [myPlanTier, setMyPlanTier] = useState('GOLD');
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    const initData = async () => {
      try {
        const [courtsRes, memberships] = await Promise.allSettled([
          courtService.getCourts(),
          membershipService.getMyMemberships(),
        ]);

        if (courtsRes.status === 'fulfilled' && courtsRes.value) {
          const list = Array.isArray(courtsRes.value) ? courtsRes.value : (courtsRes.value.data || []);
          setCourts(list);
          if (!selectedCourtId && list.length > 0) {
            setSelectedCourtId(list[0].courtId);
          }
        }

        if (memberships.status === 'fulfilled' && memberships.value?.length > 0) {
          const activeMem = memberships.value.find(m => m.status === 'ACTIVE') || memberships.value[0];
          setMyPlanTier(activeMem.planCategory || 'GOLD');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    if (selectedCourtId && selectedDate) {
      setLoadingSlots(true);
      setErrorMsg('');
      courtService.getCourtAvailability(selectedCourtId, selectedDate)
        .then(res => {
          const list = Array.isArray(res) ? res : (res.data || []);
          setSlots(list);
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedCourtId, selectedDate]);

  const selectedCourt = courts.find(c => String(c.courtId) === String(selectedCourtId));

  // Pricing calculations based on tier
  const baseRate = selectedCourt ? selectedCourt.standardHourlyRate : 500;
  let discountPct = 0;
  if (myPlanTier === 'GOLD') discountPct = 100;
  else if (myPlanTier === 'SILVER') discountPct = 25;
  else if (myPlanTier === 'JUNIOR') discountPct = 50;

  const discountAmt = (baseRate * discountPct) / 100;
  const finalRate = Math.max(0, baseRate - discountAmt);

  const filteredCourts = courts.filter(c => {
    if (selectedSport === 'ALL') return true;
    return c.sportType?.toUpperCase() === selectedSport.toUpperCase();
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select an available 60-minute court slot.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);

    try {
      const payload = {
        courtId: Number(selectedCourtId),
        memberId: user?.id || 1,
        guestName: user?.fullName || 'Club Member',
        guestEmail: user?.email || 'member@clubsphere.com',
        guestPhone: user?.phone || '+91 9800000000',
        bookingDate: selectedDate,
        startTime: selectedSlot.includes(':') ? (selectedSlot.length === 5 ? selectedSlot + ':00' : selectedSlot) : '10:00:00',
        paymentMode: finalRate === 0 ? 'MEMBERSHIP_QUOTA' : 'UPI_ONLINE',
        notes: `Booked via ClubSphere Member Portal (${myPlanTier} Tier)`,
      };

      const res = await courtService.createBooking(payload);
      setSuccessReceipt(res.booking || res);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to book court. The slot may have just been reserved.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Reserve a Court" subtitle="Slot availability and online reservations">
        <Loader message="Loading club court roster..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Reserve a Sports Court"
      subtitle="Select your preferred sport, court, and time slot with automatic membership privileges"
    >
      {/* Success Modal */}
      {successReceipt && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem',
        }}>
          <div className="cs-card" style={{ maxWidth: '500px', width: '100%', textAlign: 'center', padding: '2.5rem' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F5132', marginBottom: '0.5rem' }}>
              Court Booking Confirmed!
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.925rem', marginBottom: '1.5rem' }}>
              Your reservation has been recorded. Present this booking code or your QR Member Pass at the facility entrance.
            </p>

            <div style={{ backgroundColor: '#f8faf9', border: '1px dashed #0F5132', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Booking Reference:</span>
                <strong style={{ fontFamily: 'monospace', color: '#0F5132' }}>{successReceipt.bookingReference || 'CS-BK-2026-CONF'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Court:</span>
                <strong>{selectedCourt?.courtName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Date & Time:</span>
                <strong>{selectedDate} at {selectedSlot}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Fee Paid:</span>
                <strong style={{ color: '#0F5132' }}>₹{finalRate} ({myPlanTier} Quota)</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/member/my-bookings')} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                View My Bookings
              </button>
              <button onClick={() => { setSuccessReceipt(null); setSelectedSlot(''); }} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem' }}>
                Book Another
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Benefit Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 100%)',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        color: '#ffffff',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            AUTHENTICATED MEMBER STATUS
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
            {user?.fullName} &bull; <span style={{ color: '#fef08a' }}>{myPlanTier} Tier Privileges</span>
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.875rem' }}>
            {myPlanTier === 'GOLD' && '🌟 Gold Member: 100% Free Court Access Quota applies automatically.'}
            {myPlanTier === 'SILVER' && '🥈 Silver Member: 25% Discount applied on regular court rates.'}
            {myPlanTier === 'JUNIOR' && '🎾 Junior Member: 50% Youth Training Discount applies.'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#86efac' }}>Discount Applied</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{discountPct}% OFF</div>
        </div>
      </div>

      {errorMsg && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <AlertCircle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Column: Court & Date Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Step 1: Sport Selection */}
          <div className="cs-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
              1. Select Sport Discipline
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ALL', 'TENNIS', 'CRICKET', 'PADEL', 'BADMINTON'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => { setSelectedSport(sp); setSelectedSlot(''); }}
                  style={{
                    padding: '0.5rem 1.1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    backgroundColor: selectedSport === sp ? '#0F5132' : '#f3f4f6',
                    color: selectedSport === sp ? '#ffffff' : '#374151',
                    border: '1px solid',
                    borderColor: selectedSport === sp ? '#0F5132' : '#e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Court */}
          <div className="cs-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
              2. Choose Available Court
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredCourts.map((c) => {
                const isSelected = String(c.courtId) === String(selectedCourtId);
                return (
                  <div
                    key={c.courtId}
                    onClick={() => { setSelectedCourtId(c.courtId); setSelectedSlot(''); }}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: isSelected ? '#0F5132' : '#e5e7eb',
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{c.courtName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', gap: '12px', marginTop: '2px' }}>
                        <span>📍 {c.location || 'Main Arena'}</span>
                        <span>👟 {c.surfaceType || 'Synthetic'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#0F5132', fontSize: '0.95rem' }}>
                        ₹{c.standardHourlyRate}/hr
                      </div>
                      <Badge type={c.courtStatus}>{c.courtStatus}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 3: Date Picker */}
          <div className="cs-card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '1rem' }}>
              3. Select Booking Date
            </h3>
            <div style={{ position: 'relative' }}>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  width: '100%',
                  fontSize: '1rem',
                }}
              />
            </div>
          </div>

        </div>

        {/* Right Column: Time Slots & Checkout Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Step 4: Time Slot Matrix */}
          <div className="cs-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                4. Select Time Slot (60 Minutes)
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {slots.length} daily intervals
              </span>
            </div>

            {loadingSlots ? (
              <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <Loader message="Checking court slot availability..." />
              </div>
            ) : slots.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280', fontSize: '0.9rem' }}>
                Select a court and date to inspect available time intervals.
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                gap: '8px',
                maxHeight: '280px',
                overflowY: 'auto',
                paddingRight: '4px',
              }}>
                {slots.map((s, idx) => {
                  const isAvailable = s.isAvailable !== false;
                  const isChosen = selectedSlot === s.slotTime;

                  return (
                    <button
                      key={idx}
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlot(s.slotTime)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: isChosen ? '#0F5132' : isAvailable ? '#d1d5db' : '#f3f4f6',
                        backgroundColor: isChosen ? '#0F5132' : isAvailable ? '#ffffff' : '#f9fafb',
                        color: isChosen ? '#ffffff' : isAvailable ? '#111827' : '#9ca3af',
                        fontSize: '0.85rem',
                        fontWeight: isChosen ? 700 : 500,
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Clock size={14} />
                      <span>{s.slotTime}</span>
                      <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>
                        {isAvailable ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 5: Pricing & Confirm Card */}
          <div className="cs-card" style={{ borderTop: '4px solid #0F5132' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem' }}>
              Booking Summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Selected Court:</span>
                <strong style={{ color: '#111827' }}>{selectedCourt?.courtName || 'None'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Date & Slot:</span>
                <strong>{selectedDate} &bull; {selectedSlot || 'Select slot'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Standard Rack Rate:</span>
                <span>₹{baseRate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F5132', fontWeight: 600 }}>
                <span>{myPlanTier} Membership Privilege ({discountPct}%):</span>
                <span>-₹{discountAmt}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px solid #e5e7eb',
                paddingTop: '0.75rem',
                fontSize: '1.2rem',
                fontWeight: 800,
              }}>
                <span>Total Payable:</span>
                <span style={{ color: '#0F5132' }}>₹{finalRate}</span>
              </div>
            </div>

            <button
              onClick={handleBookingSubmit}
              disabled={submitting || !selectedSlot}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1rem',
                borderRadius: '10px',
                opacity: (!selectedSlot || submitting) ? 0.6 : 1,
              }}
            >
              {submitting ? 'Confirming Reservation...' : 'Confirm Court Booking'}
            </button>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};
