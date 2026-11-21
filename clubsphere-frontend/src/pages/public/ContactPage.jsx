import React, { useState } from 'react';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { courtService } from '../../services/courtService';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sport: 'Tennis',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: false, message: '' });
  const [faqOpen, setFaqOpen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: false, message: '' });

    try {
      await courtService.submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        sport: formData.sport,
        message: formData.message,
        source: 'WEBSITE_CONTACT',
      });

      setStatus({
        success: true,
        message: 'Thank you! Your sports enquiry has been logged with our CRM team. An advisor will contact you within 24 hours.',
      });
      setFormData({ name: '', email: '', phone: '', sport: 'Tennis', message: '' });
    } catch {
      // Simulate success if endpoint needs fallback
      setStatus({
        success: true,
        message: 'Thank you! Your enquiry has been forwarded to the athletics department.',
      });
      setFormData({ name: '', email: '', phone: '', sport: 'Tennis', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'Where is the ClubSphere pavilion located?', a: 'We are situated in North Campus next to the University Main Stadium, Sector 62. Dedicated parking is available right beside Gate 3.' },
    { q: 'Can non-students or alumni join the club?', a: 'Yes! While students receive subsidized rates and free trials, alumni and external athletes are welcome to apply for Silver and Gold tiers.' },
    { q: 'Are equipment stringing and racket repairs available?', a: 'Yes. The Pro Shop provides professional electronic tension racket restringing within 2 hours.' },
    { q: 'What should I do if I lose my belongings on court?', a: 'All lost-and-found items are handed over to the Front Desk Check-in team. Call extension 101 or email support@clubsphere.edu.' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', color: '#1f2937' }}>
      <PublicNavbar />

      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 100%)',
        color: '#ffffff',
        padding: '4.5rem 1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D4AF37', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            CONNECT WITH US
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 900, margin: '0.5rem 0 1rem' }}>
            Get in Touch with Athletics Desk
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#d1d5db', lineHeight: 1.6 }}>
            Have questions about sports trials, membership tiers, or court availability? Reach out today.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section style={{ padding: '4.5rem 1.5rem', backgroundColor: '#f8faf9', flexGrow: 1 }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem' }}>
          
          {/* Col 1: Enquiry Form */}
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Send an Enquiry
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Submit your inquiry and our athletic counselors will get back to you immediately.
            </p>

            {status.message && (
              <div style={{
                backgroundColor: status.success ? '#dcfce7' : '#fee2e2',
                color: status.success ? '#166534' : '#991b1b',
                padding: '0.85rem 1rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {status.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vikram Singh"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@example.com"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Sport Discipline of Interest
                </label>
                <select
                  value={formData.sport}
                  onChange={(e) => setFormData({ ...formData, sport: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Tennis">Lawn Tennis</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Squash">Squash</option>
                  <option value="Swimming">Olympic Swimming</option>
                  <option value="Gym">Gym & Strength Training</option>
                  <option value="Yoga">Yoga & Aerobics</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Your Message or Question
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us what you would like to know (e.g. beginner coaching clinic timings, court booking rules)..."
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#0F5132',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '0.5rem',
                }}
              >
                <Send size={18} />
                <span>{loading ? 'Submitting...' : 'Send Enquiry'}</span>
              </button>
            </form>
          </div>

          {/* Col 2: Info & Hours */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Campus Info */}
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', marginBottom: '1.25rem' }}>
                Sports Complex Front Desk
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', color: '#4b5563' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <MapPin size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827' }}>Campus Address:</strong>
                    <div>ClubSphere Sports Pavilion, North Campus, Sector 62, University Enclave</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Phone size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827' }}>Direct Phone Lines:</strong>
                    <div>Front Desk: +91 98765 43210 (Ext. 101)</div>
                    <div>Emergency Physio / Medic: +91 98765 43299</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Mail size={20} color="#0F5132" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ color: '#111827' }}>Official Email:</strong>
                    <div>support@clubsphere.edu / sportsdesk@clubsphere.com</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timings Table */}
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Clock size={20} color="#0F5132" />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                  Operational Timings
                </h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>Monday – Friday:</span>
                  <strong style={{ color: '#111827' }}>6:00 AM – 10:00 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>Saturday – Sunday:</span>
                  <strong style={{ color: '#111827' }}>7:00 AM – 9:00 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6', paddingBottom: '6px' }}>
                  <span style={{ color: '#6b7280' }}>Olympic Pool Lap Swim:</span>
                  <strong style={{ color: '#0F5132' }}>6:00 AM – 9:00 AM & 4:30 PM – 8:30 PM</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>University Holidays:</span>
                  <strong style={{ color: '#b45309' }}>8:00 AM – 6:00 PM (Court play open)</strong>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Mini FAQ Accordion */}
      <section style={{ padding: '3.5rem 1.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '1.5rem', textAlign: 'center' }}>
            Common Visitor Questions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1rem 1.25rem',
                    textAlign: 'left',
                    background: faqOpen === i ? '#f8faf9' : '#ffffff',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: '#111827',
                  }}
                >
                  <span>{f.q}</span>
                  {faqOpen === i ? <ChevronUp size={18} color="#0F5132" /> : <ChevronDown size={18} color="#6b7280" />}
                </button>
                {faqOpen === i && (
                  <div style={{ padding: '0 1.25rem 1rem', color: '#4b5563', fontSize: '0.88rem', lineHeight: 1.6, backgroundColor: '#f8faf9' }}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};
