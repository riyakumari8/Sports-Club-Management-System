import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Clock, Users, ArrowRight, ShieldCheck, Sun, CheckCircle } from 'lucide-react';
import { getPublicFacilities } from '../services/api';

export default function SportsFacilities() {
  const [courts, setCourts] = useState([]);
  const [sportFilter, setSportFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicFacilities()
      .then(res => {
        setCourts(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredCourts = sportFilter === 'ALL' 
    ? courts 
    : courts.filter(c => c.sportType.toUpperCase() === sportFilter);

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: 720, marginBottom: 40 }}>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>Sports & Arenas</span>
          <h1 className="title-serif" style={{ fontSize: '2.8rem', color: '#0f3e2e', marginBottom: 16 }}>
            Championship Sports Facilities
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
            ClubSphere offers state-of-the-art tennis facilities and professional cricket grounds. Every court is maintained to national standards with high-lumen floodlights, premium nets, and dedicated changing suites.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 36, flexWrap: 'wrap' }}>
          {['ALL', 'TENNIS', 'CRICKET'].map(sport => (
            <button
              key={sport}
              onClick={() => setSportFilter(sport)}
              className={`btn btn-sm ${sportFilter === sport ? 'btn-primary' : 'btn-outline'}`}
              style={{ borderRadius: 9999, padding: '8px 20px' }}
            >
              {sport === 'ALL' ? 'All Arenas' : sport}
            </button>
          ))}
        </div>

        {/* Court Cards Grid */}
        <div className="grid-3">
          {filteredCourts.map(court => (
            <div key={court.courtId} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 230, position: 'relative' }}>
                <img 
                  src={court.imageUrl || 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=600'} 
                  alt={court.courtName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span 
                  className="badge"
                  style={{ 
                    position: 'absolute', top: 12, left: 12, 
                    backgroundColor: court.sportType === 'TENNIS' ? '#0f3e2e' : '#b45309', 
                    color: '#fff' 
                  }}
                >
                  {court.sportType}
                </span>
                <span 
                  className={`badge ${court.courtStatus === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}
                  style={{ position: 'absolute', top: 12, right: 12 }}
                >
                  {court.courtStatus.replace('_', ' ')}
                </span>
              </div>

              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f3e2e', marginBottom: 8 }}>
                    {court.courtName}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: '0.85rem', marginBottom: 12 }}>
                    <span>📍 {court.location || 'Club Ground'}</span>
                    <span>•</span>
                    <span><Users size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Max {court.capacity} Players</span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: 20, lineHeight: 1.5 }}>
                    {court.courtDescription}
                  </p>

                  <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: 10, marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: 6 }}>
                      <span><strong>Surface Type:</strong></span>
                      <span style={{ color: '#0f172a' }}>{court.surfaceType || 'Hard Synthetic'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b' }}>
                      <span><strong>Operating Hours:</strong></span>
                      <span style={{ color: '#0f172a' }}>{court.openingTime.substring(0,5)} – {court.closingTime.substring(0,5)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f3e2e' }}>₹ {court.standardHourlyRate}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Member Rate / hour</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#64748b' }}>₹ {court.guestHourlyRate}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Guest Rate / hour</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <Link to={`/availability?courtId=${court.courtId}`} className="btn btn-outline btn-sm">
                      Slots
                    </Link>
                    <Link to={`/book?courtId=${court.courtId}`} className="btn btn-primary btn-sm">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
