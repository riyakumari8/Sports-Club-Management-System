import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, CheckCircle2, AlertCircle, ShieldCheck, 
  ArrowRight, User, CreditCard, Sparkles, X
} from 'lucide-react';
import { getPublicFacilities, getCourtAvailability, createBooking } from '../services/api';

export default function BookCourt() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [courts, setCourts] = useState([]);
  const [selectedSport, setSelectedSport] = useState('ALL');
  const [selectedCourtId, setSelectedCourtId] = useState(searchParams.get('courtId') || '');
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(searchParams.get('time') || '');

  // User type & tier
  const [isMember, setIsMember] = useState(true);
  const [memberId, setMemberId] = useState(101);
  const [memberTier, setMemberTier] = useState('SILVER');

  // Guest details
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  // States
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  useEffect(() => {
    getPublicFacilities().then(res => {
      setCourts(res.data);
      if (!selectedCourtId && res.data.length > 0) {
        setSelectedCourtId(res.data[0].courtId);
      }
    }).catch(() => {});
  }, [selectedCourtId]);

  useEffect(() => {
    if (selectedCourtId && selectedDate) {
      setLoadingSlots(true);
      setErrorMsg('');
      getCourtAvailability(selectedCourtId, selectedDate)
        .then(res => {
          setSlots(res.data);
          setLoadingSlots(false);
        })
        .catch(() => setLoadingSlots(false));
    }
  }, [selectedCourtId, selectedDate]);

  const selectedCourt = courts.find(c => String(c.courtId) === String(selectedCourtId));

  // Pricing calculation
  const baseRate = selectedCourt ? (isMember ? selectedCourt.standardHourlyRate : selectedCourt.guestHourlyRate) : 0;
  let discountPercentage = 0;
  if (isMember) {
    if (memberTier === 'GOLD') discountPercentage = 100;
    else if (memberTier === 'SILVER') discountPercentage = 25;
    else if (memberTier === 'JUNIOR') discountPercentage = 50;
  }
  const discountAmount = (baseRate * discountPercentage) / 100;
  const finalPayable = Math.max(0, baseRate - discountAmount);

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      setErrorMsg('Please select an available 60-minute time slot.');
      return;
    }

    if (!isMember && (!guestName || !guestEmail || !guestPhone)) {
      setErrorMsg('Please fill in your name, email, and mobile number for guest booking.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        courtId: Number(selectedCourtId),
        bookingDate: selectedDate,
        startTime: selectedSlot.length === 5 ? selectedSlot + ':00' : selectedSlot,
        memberId: isMember ? memberId : null,
        memberTier: isMember ? memberTier : 'GUEST',
        guestName: isMember ? null : guestName,
        guestEmail: isMember ? null : guestEmail,
        guestPhone: isMember ? null : guestPhone
      };

      const res = await createBooking(payload);
      setSuccessReceipt(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to complete booking. Please select another slot.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourts = selectedSport === 'ALL'
    ? courts
    : courts.filter(c => c.sportType.toUpperCase() === selectedSport);

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container">
        {/* Step Indicator */}
        <div style={{ maxWidth: 840, margin: '0 auto 36px', textAlign: 'center' }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Express Court Booking</span>
          <h1 className="title-serif" style={{ fontSize: '2.5rem', color: '#0f3e2e', marginBottom: 8 }}>
            Reserve a Playing Court
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            60-minute session slots • Overlap-proof reservation • Instant digital QR pass
          </p>
        </div>

        {errorMsg && (
          <div style={{ maxWidth: 900, margin: '0 auto 24px', backgroundColor: '#fee2e2', border: '1px solid #ef4444', color: '#991b1b', padding: '14px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>{errorMsg}</div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 32, maxWidth: 1080, margin: '0 auto' }}>
          {/* Left: Selection Form */}
          <div className="card">
            {/* Step 1: Booking As Member vs Guest */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <label className="form-label" style={{ fontSize: '0.95rem', marginBottom: 12 }}>
                1. Booking Identity:
              </label>
              <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setIsMember(true)}
                  className={`btn btn-sm ${isMember ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  <User size={15} /> Club Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsMember(false)}
                  className={`btn btn-sm ${!isMember ? 'btn-primary' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                >
                  Guest Booking
                </button>
              </div>

              {isMember ? (
                <div style={{ backgroundColor: '#f8fafc', padding: 14, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Member ID:</label>
                      <input 
                        type="number" 
                        value={memberId} 
                        onChange={e => setMemberId(Number(e.target.value))}
                        className="form-control"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Membership Tier:</label>
                      <select 
                        value={memberTier} 
                        onChange={e => setMemberTier(e.target.value)}
                        className="form-control"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      >
                        <option value="GOLD">Gold (100% Free Quota)</option>
                        <option value="SILVER">Silver (25% Discount)</option>
                        <option value="JUNIOR">Junior (50% Discount)</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={guestName} 
                    onChange={e => setGuestName(e.target.value)}
                    className="form-control" 
                    required 
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <input 
                      type="email" 
                      placeholder="Email Address" 
                      value={guestEmail} 
                      onChange={e => setGuestEmail(e.target.value)}
                      className="form-control" 
                      required 
                    />
                    <input 
                      type="tel" 
                      placeholder="Mobile Phone" 
                      value={guestPhone} 
                      onChange={e => setGuestPhone(e.target.value)}
                      className="form-control" 
                      required 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Select Sport & Court */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <label className="form-label">2. Select Sport & Court Facility:</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {['ALL', 'TENNIS', 'CRICKET'].map(sp => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => {
                      setSelectedSport(sp);
                      const matching = courts.filter(c => sp === 'ALL' || c.sportType.toUpperCase() === sp);
                      if (matching.length > 0) setSelectedCourtId(matching[0].courtId);
                    }}
                    className={`btn btn-sm ${selectedSport === sp ? 'btn-primary' : 'btn-outline'}`}
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                  >
                    {sp}
                  </button>
                ))}
              </div>

              <select 
                value={selectedCourtId} 
                onChange={e => setSelectedCourtId(e.target.value)}
                className="form-control"
              >
                {filteredCourts.map(c => (
                  <option key={c.courtId} value={c.courtId}>
                    {c.courtName} ({c.sportType} • {c.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Step 3: Select Date */}
            <div style={{ marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid #e2e8f0' }}>
              <label className="form-label">3. Select Match Date:</label>
              <input 
                type="date" 
                value={selectedDate} 
                min={new Date().toISOString().split('T')[0]}
                onChange={e => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
                className="form-control"
              />
            </div>

            {/* Step 4: Staggered Slot Picker */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <label className="form-label" style={{ marginBottom: 0 }}>4. Choose 1-Hour Time Slot:</label>
                <span style={{ fontSize: '0.78rem', color: '#64748b' }}>Opens every 30 mins</span>
              </div>

              {loadingSlots ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>
                  Loading available slots...
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                  {slots.map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSelectedSlot(s.startTime)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 8,
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        border: selectedSlot === s.startTime ? '2px solid #0f3e2e' : '1px solid #e2e8f0',
                        backgroundColor: selectedSlot === s.startTime 
                          ? '#0f3e2e' 
                          : (s.available ? '#ffffff' : '#f1f5f9'),
                        color: selectedSlot === s.startTime 
                          ? '#ffffff' 
                          : (s.available ? '#0f3e2e' : '#94a3b8'),
                        cursor: s.available ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                      }}
                    >
                      <span>{s.startTime.substring(0,5)}</span>
                      <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                        {s.available ? 'Available' : 'Booked'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary & Confirmation Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 96, border: '2px solid #0f3e2e' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <Sparkles size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3e2e' }}>Reservation Summary</h3>
              </div>

              {selectedCourt ? (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f3e2e' }}>{selectedCourt.courtName}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedCourt.sportType} • {selectedCourt.location}</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Surface: {selectedCourt.surfaceType}</div>
                </div>
              ) : null}

              <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '16px 0', marginBottom: 20, fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date:</span>
                  <strong>{selectedDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Time Slot:</span>
                  <strong>{selectedSlot ? `${selectedSlot.substring(0,5)} (1 Hour)` : 'Not Selected'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Rate Type:</span>
                  <span>{isMember ? `Member (${memberTier})` : 'Guest Rate'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Base Hourly Fee:</span>
                  <span>₹ {baseRate.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669', fontWeight: 600 }}>
                    <span>Membership Discount ({discountPercentage}%):</span>
                    <span>- ₹ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, color: '#0f3e2e', borderTop: '1px dashed #e2e8f0', paddingTop: 10 }}>
                  <span>Final Payable:</span>
                  <span>₹ {finalPayable.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ marginBottom: 20, fontSize: '0.8rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="#10b981" /> Overlap-proof backend validation active
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={14} color="#10b981" /> Max 2 sessions per member / day enforced
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={submitting || !selectedSlot}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              >
                {submitting ? 'Verifying & Reserving...' : 'Confirm Court Booking'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal with QR Code */}
      {successReceipt && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ width: 64, height: 64, backgroundColor: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={36} color="#059669" />
            </div>

            <h2 className="title-serif" style={{ fontSize: '1.8rem', color: '#0f3e2e', marginBottom: 8 }}>
              Booking Confirmed!
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>
              Your court is reserved. Present this digital pass at the front desk for QR check-in.
            </p>

            {/* QR Code Card */}
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0', marginBottom: 24 }}>
              <div style={{ fontWeight: 800, color: '#0f3e2e', fontSize: '1.2rem', marginBottom: 4 }}>
                {successReceipt.booking?.bookingReference}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 16 }}>
                {successReceipt.booking?.court?.courtName} • {successReceipt.booking?.bookingDate}
              </div>

              {successReceipt.qrCodeDataUri && (
                <img 
                  src={successReceipt.qrCodeDataUri} 
                  alt="Booking Check-In QR" 
                  style={{ width: 180, height: 180, borderRadius: 8, margin: '0 auto', display: 'block', border: '2px solid #0f3e2e' }}
                />
              )}

              <div style={{ marginTop: 14, fontSize: '0.85rem', fontWeight: 600, color: '#0f3e2e' }}>
                Slot: {successReceipt.booking?.startTime?.substring(0,5)} – {successReceipt.booking?.endTime?.substring(0,5)}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#059669' }}>
                Amount Paid: ₹ {successReceipt.booking?.finalAmount} (Status: CONFIRMED)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button
                onClick={() => setSuccessReceipt(null)}
                className="btn btn-outline"
              >
                Book Another
              </button>
              <Link to="/my-bookings" className="btn btn-primary">
                View My Bookings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
