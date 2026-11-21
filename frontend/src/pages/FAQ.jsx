import React, { useEffect, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getPublicFaqs } from '../services/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    getPublicFaqs().then(res => setFaqs(res.data)).catch(() => {});
  }, []);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <HelpCircle size={13} /> Common Queries
          </span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 16 }}>
            Frequently Asked Questions
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Everything you need to know about court reservations, 30-minute slot increments, membership plans, cancellations, and QR check-in.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div 
                key={idx} 
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  border: isOpen ? '1.5px solid #0f3e2e' : '1px solid #e2e8f0'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: isOpen ? '#f8fafc' : '#ffffff',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: '#0f3e2e'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{faq.category}</span>
                    <span>{faq.question}</span>
                  </span>
                  {isOpen ? <ChevronUp size={20} color="#0f3e2e" /> : <ChevronDown size={20} color="#64748b" />}
                </button>

                {isOpen && (
                  <div style={{ padding: '20px 24px', backgroundColor: '#ffffff', color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, borderTop: '1px solid #e2e8f0' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
