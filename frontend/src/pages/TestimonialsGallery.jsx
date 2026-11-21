import React, { useEffect, useState } from 'react';
import { Star, Camera, Trophy, Award } from 'lucide-react';
import { getPublicTestimonials } from '../services/api';

export default function TestimonialsGallery() {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getPublicTestimonials().then(res => setTestimonials(res.data)).catch(() => {});
  }, []);

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800', title: 'Centre Court 1 • Championship Acrylic Hard' },
    { url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', title: 'Clay Court 2 • European Red Clay' },
    { url: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800', title: 'Indoor Arena • Climate-Controlled Synthetic Grass' },
    { url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800', title: 'Main Cricket Oval • Natural Turf & Sight Screens' },
    { url: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800', title: 'Indoor Cricket Nets • High-Speed Bowling Lane' },
    { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', title: 'Club Pro Shop • Premium Footwear & Rackets' },
  ];

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            <Camera size={13} /> Club Atmosphere
          </span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 16 }}>
            ClubSphere Gallery & Testimonials
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Take a visual tour through our sporting arenas and hear what our active club members and guest athletes have to say.
          </p>
        </div>

        {/* Gallery Grid */}
        <h2 className="title-serif" style={{ fontSize: '2rem', color: '#0f3e2e', marginBottom: 24 }}>Facilities Showcase</h2>
        <div className="grid-3" style={{ marginBottom: 64 }}>
          {galleryImages.map((img, idx) => (
            <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden', height: 260, position: 'relative' }}>
              <img 
                src={img.url} 
                alt={img.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(15, 62, 46, 0.9), transparent)',
                  padding: '24px 16px 12px',
                  color: '#fff',
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                {img.title}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="title-serif" style={{ fontSize: '2rem', color: '#0f3e2e', marginBottom: 24 }}>Member Feedback</h2>
        <div className="grid-3">
          {testimonials.map(t => (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 28 }}>
              <div>
                <div style={{ display: 'flex', gap: 4, color: '#f59e0b', marginBottom: 14 }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p style={{ color: '#334155', fontStyle: 'italic', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.6 }}>
                  "{t.content}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <img src={t.avatar} alt={t.name} style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f3e2e' }}>{t.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
