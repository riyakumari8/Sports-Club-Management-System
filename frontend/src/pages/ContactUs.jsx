import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { submitEnquiry, submitTrialBooking } from '../services/api';

export default function ContactUs() {
  const [searchParams] = useSearchParams();
  const [activeForm, setActiveForm] = useState('ENQUIRY'); // 'ENQUIRY' or 'TRIAL'

  // Enquiry form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sport, setSport] = useState('TENNIS');
  const [plan, setPlan] = useState(searchParams.get('plan') || 'GOLD');
  const [message, setMessage] = useState('');
  const [contactMethod, setContactMethod] = useState('PHONE');

  // Trial form state
  const [trialName, setTrialName] = useState('');
  const [trialEmail, setTrialEmail] = useState('');
  const [trialPhone, setTrialPhone] = useState('');
  const [trialSport, setTrialSport] = useState('TENNIS');
  const [trialDate, setTrialDate] = useState(new Date().toISOString().split('T')[0]);
  const [trialTime, setTrialTime] = useState('17:00');

  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ text: '', type: '' });

    try {
      await submitEnquiry({
        fullName,
        email,
        phone,
        interestedSport: sport,
        interestedPlan: plan,
        enquiryMessage: message,
        preferredContactMethod: contactMethod
      });
      setFeedback({ 
        text: 'Thank you! Your enquiry has been received. Our membership team will contact you shortly.', 
        type: 'success' 
      });
      setFullName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setFeedback({ 
        text: err.response?.data?.message || 'Failed to submit enquiry. Please check your fields.', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ text: '', type: '' });

    try {
      await submitTrialBooking({
        fullName: trialName,
        email: trialEmail,
        phone: trialPhone,
        preferredSport: trialSport,
        trialDate,
        startTime: trialTime.length === 5 ? trialTime + ':00' : trialTime
      });
      setFeedback({ 
        text: 'Your trial session request has been submitted! Our staff will confirm your slot within 2 hours.', 
        type: 'success' 
      });
      setTrialName('');
      setTrialEmail('');
      setTrialPhone('');
    } catch (err) {
      setFeedback({ 
        text: err.response?.data?.message || 'Failed to submit trial request.', 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 700, marginBottom: 44 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Connect With ClubSphere</span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 12 }}>
            Contact Us & Inquiries
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Whether you want to inquire about Gold membership privileges, schedule a complimentary trial session, or speak with our sports director, we'd love to hear from you.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'flex-start' }}>
          {/* Left: Interactive Form */}
          <div className="card" style={{ padding: 36 }}>
            {/* Toggle Enquiry vs Trial */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, borderBottom: '1px solid #e2e8f0', paddingBottom: 16 }}>
              <button
                type="button"
                onClick={() => { setActiveForm('ENQUIRY'); setFeedback({ text: '', type: '' }); }}
                className={`btn btn-sm ${activeForm === 'ENQUIRY' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Membership Enquiry
              </button>
              <button
                type="button"
                onClick={() => { setActiveForm('TRIAL'); setFeedback({ text: '', type: '' }); }}
                className={`btn btn-sm ${activeForm === 'TRIAL' ? 'btn-primary' : 'btn-outline'}`}
                style={{ flex: 1 }}
              >
                Book a Trial Session
              </button>
            </div>

            {feedback.text && (
              <div 
                style={{ 
                  backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2', 
                  color: feedback.type === 'success' ? '#065f46' : '#991b1b',
                  padding: '12px 16px', 
                  borderRadius: 8, 
                  marginBottom: 20, 
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10
                }}
              >
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{feedback.text}</span>
              </div>
            )}

            {activeForm === 'ENQUIRY' ? (
              <form onSubmit={handleEnquirySubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    value={fullName} 
                    onChange={e => setFullName(e.target.value)}
                    className="form-control" 
                    placeholder="e.g. Rahul Sharma" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="form-control" 
                      placeholder="rahul@example.com" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)}
                      className="form-control" 
                      placeholder="+91 98765 43210" 
                      required 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Sport of Interest</label>
                    <select value={sport} onChange={e => setSport(e.target.value)} className="form-control">
                      <option value="TENNIS">Tennis</option>
                      <option value="CRICKET">Cricket</option>
                      <option value="PADEL">Padel</option>
                      <option value="BADMINTON">Badminton</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Membership Tier</label>
                    <select value={plan} onChange={e => setPlan(e.target.value)} className="form-control">
                      <option value="GOLD">Gold (Full Access)</option>
                      <option value="SILVER">Silver (Standard)</option>
                      <option value="JUNIOR">Junior (Under 18)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Contact Method</label>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {['PHONE', 'EMAIL', 'WHATSAPP'].map(m => (
                      <label key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.88rem', cursor: 'pointer' }}>
                        <input 
                          type="radio" 
                          name="contactMethod" 
                          value={m} 
                          checked={contactMethod === m} 
                          onChange={() => setContactMethod(m)} 
                        />
                        {m}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message / Specific Questions</label>
                  <textarea 
                    rows={3} 
                    value={message} 
                    onChange={e => setMessage(e.target.value)}
                    className="form-control" 
                    placeholder="Tell us about your playing experience, coaching needs, or preferred schedule..."
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  <Send size={16} /> {submitting ? 'Submitting...' : 'Send Inquiry'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleTrialSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    value={trialName} 
                    onChange={e => setTrialName(e.target.value)}
                    className="form-control" 
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email" 
                      value={trialEmail} 
                      onChange={e => setTrialEmail(e.target.value)}
                      className="form-control" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input 
                      type="tel" 
                      value={trialPhone} 
                      onChange={e => setTrialPhone(e.target.value)}
                      className="form-control" 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Preferred Sport *</label>
                  <select value={trialSport} onChange={e => setTrialSport(e.target.value)} className="form-control">
                    <option value="TENNIS">Tennis (Clay / Hard Court)</option>
                    <option value="CRICKET">Cricket (Automated Bowling Net)</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Requested Date</label>
                    <input 
                      type="date" 
                      value={trialDate} 
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setTrialDate(e.target.value)}
                      className="form-control" 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Start Time</label>
                    <input 
                      type="time" 
                      value={trialTime} 
                      onChange={e => setTrialTime(e.target.value)}
                      className="form-control" 
                      required 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  {submitting ? 'Submitting Trial...' : 'Request Free Trial Session'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Contact Information & Location */}
          <div>
            <div className="card" style={{ padding: 32, marginBottom: 28 }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 20 }}>
                Club Information
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, fontSize: '0.95rem' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <MapPin size={22} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>ClubSphere Sports Complex</strong>
                    <div style={{ color: '#64748b', marginTop: 2 }}>
                      Sector 4, Champions Sports Enclave, Near Koramangala, Bengaluru, Karnataka 560034
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Phone size={22} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Direct Desk Lines</strong>
                    <div style={{ color: '#64748b', marginTop: 2 }}>
                      +91 98765 43210 (Court Reservations)
                    </div>
                    <div style={{ color: '#64748b' }}>
                      +91 98123 45678 (Front Office & Trials)
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Mail size={22} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Email Contacts</strong>
                    <div style={{ color: '#64748b', marginTop: 2 }}>
                      frontdesk@clubsphere.sports.in
                    </div>
                    <div style={{ color: '#64748b' }}>
                      memberships@clubsphere.sports.in
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14 }}>
                  <Clock size={22} color="#d97706" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <strong>Operating Hours</strong>
                    <div style={{ color: '#64748b', marginTop: 2 }}>
                      Monday – Sunday: 6:00 AM – 10:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', height: 200, position: 'relative' }}>
              <img 
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800" 
                alt="Map View" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(15, 62, 46, 0.85)', backdropFilter: 'blur(4px)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600 }}>
                📍 Champions Sports Enclave, Bengaluru
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
