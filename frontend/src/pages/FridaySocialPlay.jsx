import React, { useEffect, useState } from 'react';
import { Users, Calendar, Clock, Trophy, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { getSocialPlaySessions, joinSocialPlaySession, leaveSocialPlaySession } from '../services/api';

export default function FridaySocialPlay() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join Modal
  const [joinModalSession, setJoinModalSession] = useState(null);
  const [participantName, setParticipantName] = useState('Swathi Challakonda');
  const [participantEmail, setParticipantEmail] = useState('swathi@example.com');
  const [memberId, setMemberId] = useState(101);
  const [joining, setJoining] = useState(false);
  const [joinMsg, setJoinMsg] = useState({ text: '', type: '' });

  const fetchSessions = () => {
    setLoading(true);
    getSocialPlaySessions()
      .then(res => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!participantName) return;
    setJoining(true);
    setJoinMsg({ text: '', type: '' });

    try {
      await joinSocialPlaySession(joinModalSession.sessionId, {
        memberId: memberId || null,
        participantName,
        participantEmail
      });
      setJoinMsg({ text: 'Successfully joined Friday Social Play!', type: 'success' });
      setTimeout(() => {
        setJoinModalSession(null);
        setJoinMsg({ text: '', type: '' });
        fetchSessions();
      }, 1200);
    } catch (err) {
      setJoinMsg({ 
        text: err.response?.data?.message || 'Failed to join session. Might be at full capacity.', 
        type: 'error' 
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="container">
        {/* Hero Banner */}
        <div 
          style={{ 
            background: 'linear-gradient(135deg, #0f3e2e 0%, #165b43 100%)', 
            borderRadius: 24, 
            color: '#fff', 
            padding: '48px 40px',
            marginBottom: 48,
            boxShadow: '0 12px 30px rgba(15, 62, 46, 0.15)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: 32,
            alignItems: 'center'
          }}
        >
          <div>
            <span className="badge badge-warning" style={{ marginBottom: 12 }}>
              <Sparkles size={13} /> Weekly Club Tradition
            </span>
            <h1 className="title-serif" style={{ fontSize: '2.8rem', marginBottom: 16 }}>
              Friday Night Social Play
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 24 }}>
              Experience the energetic community spirit of ClubSphere! Every Friday from 6:00 PM to 9:00 PM, we host rotating doubles tennis matches and indoor practice nets. No partner required—come play, socialize, and connect with fellow players.
            </p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: 12 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>6:00 – 9:00 PM</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Every Friday Evening</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px 18px', borderRadius: 12 }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>₹ 150 Entry</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Free for Gold Members</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600" 
              alt="Social Tennis" 
              style={{ width: '100%', height: 260, objectFit: 'cover', borderRadius: 16, border: '2px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        </div>

        {/* Upcoming Sessions List */}
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="title-serif" style={{ fontSize: '2rem', color: '#0f3e2e' }}>Upcoming Social Sessions</h2>
            <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Reserve your roster slot before the 16-player cap is reached.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#64748b' }}>
            Loading social play sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Users size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f3e2e', marginBottom: 8 }}>No scheduled social sessions</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Check back soon or ask at the front desk for upcoming dates.</p>
          </div>
        ) : (
          <div className="grid-2">
            {sessions.map(s => {
              const spotsLeft = s.maxParticipants - s.currentParticipants;
              const isFull = spotsLeft <= 0 || s.sessionStatus === 'FULL';

              return (
                <div key={s.sessionId} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <span className="badge badge-primary" style={{ marginBottom: 6 }}>{s.court?.sportType}</span>
                        <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f3e2e' }}>{s.title}</h3>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>📍 {s.court?.courtName}</div>
                      </div>
                      <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                        {isFull ? 'SESSION FULL' : `${spotsLeft} SPOTS LEFT`}
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: 12, margin: '16px 0', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Date:</div>
                        <strong style={{ color: '#0f3e2e' }}>{s.sessionDate}</strong>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Time:</div>
                        <strong style={{ color: '#0f3e2e' }}>{s.startTime?.substring(0,5)} – {s.endTime?.substring(0,5)}</strong>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Entry Fee:</div>
                        <strong style={{ color: '#059669' }}>₹ {s.entryFee}</strong>
                      </div>
                    </div>

                    {/* Progress Bar of Capacity */}
                    <div style={{ marginBottom: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
                        <span style={{ color: '#64748b' }}>Registered Participants:</span>
                        <strong style={{ color: '#0f3e2e' }}>{s.currentParticipants} / {s.maxParticipants}</strong>
                      </div>
                      <div style={{ width: '100%', height: 8, backgroundColor: '#e2e8f0', borderRadius: 9999, overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${(s.currentParticipants / s.maxParticipants) * 100}%`, 
                            height: '100%', 
                            backgroundColor: isFull ? '#ef4444' : '#10b981',
                            transition: 'width 0.3s ease'
                          }} 
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setJoinModalSession(s);
                      setJoinMsg({ text: '', type: '' });
                    }}
                    disabled={isFull}
                    className={`btn ${isFull ? 'btn-outline' : 'btn-primary'}`}
                    style={{ width: '100%', cursor: isFull ? 'not-allowed' : 'pointer' }}
                  >
                    {isFull ? 'Sold Out' : 'Join Friday Social (₹ ' + s.entryFee + ')'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Join Session Modal */}
      {joinModalSession && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 440 }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f3e2e', marginBottom: 6 }}>
              Join Friday Social Play
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: 20 }}>
              {joinModalSession.title} on {joinModalSession.sessionDate} at {joinModalSession.court?.courtName}
            </p>

            {joinMsg.text && (
              <div 
                style={{ 
                  backgroundColor: joinMsg.type === 'success' ? '#d1fae5' : '#fee2e2', 
                  color: joinMsg.type === 'success' ? '#065f46' : '#991b1b',
                  padding: '10px 14px', 
                  borderRadius: 8, 
                  marginBottom: 16, 
                  fontSize: '0.88rem',
                  fontWeight: 600
                }}
              >
                {joinMsg.text}
              </div>
            )}

            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label className="form-label">Player Name:</label>
                <input 
                  type="text" 
                  value={participantName} 
                  onChange={e => setParticipantName(e.target.value)} 
                  className="form-control" 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address:</label>
                <input 
                  type="email" 
                  value={participantEmail} 
                  onChange={e => setParticipantEmail(e.target.value)} 
                  className="form-control" 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Member ID (optional):</label>
                <input 
                  type="number" 
                  value={memberId} 
                  onChange={e => setMemberId(Number(e.target.value))} 
                  className="form-control" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                <button 
                  type="button" 
                  onClick={() => setJoinModalSession(null)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={joining} 
                  className="btn btn-primary"
                >
                  {joining ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
