import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Badge } from '../../components/common/Badge';
import { Loader } from '../../components/common/Loader';
import { useAuth } from '../../context/AuthContext';
import { courtService } from '../../services/courtService';
import {
  Users,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';

export const SocialPlayPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [joinedSessionIds, setJoinedSessionIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [msg, setMsg] = useState('');

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await courtService.getSocialPlaySessions();
      const list = Array.isArray(res) ? res : (res.data || []);
      setSessions(list);

      // Identify sessions already joined by logged-in user
      const joinedSet = new Set();
      list.forEach((s) => {
        if (s.participants && Array.isArray(s.participants)) {
          const already = s.participants.some((p) => {
            const matchesId = user?.id && Number(p.memberId) === Number(user.id);
            const matchesEmail = user?.email && p.participantEmail && p.participantEmail.toLowerCase() === user.email.toLowerCase();
            return matchesId || matchesEmail;
          });
          if (already) {
            joinedSet.add(s.sessionId);
          }
        }
      });
      setJoinedSessionIds(joinedSet);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleJoin = async (session) => {
    setJoiningId(session.sessionId);
    setMsg('');
    try {
      await courtService.joinSocialPlaySession(session.sessionId, {
        memberId: user?.id || 1,
        participantName: user?.fullName || 'Club Member',
        participantEmail: user?.email || 'member@clubsphere.com',
        playerName: user?.fullName || 'Club Member',
        playerEmail: user?.email || 'member@clubsphere.com',
        playerPhone: user?.phone || '+91 9800000000',
        skillLevel: 'INTERMEDIATE',
        isMember: true,
      });

      // Optimistically update joined state immediately
      setJoinedSessionIds((prev) => new Set([...prev, session.sessionId]));
      setMsg(`You have successfully joined ${session.title || session.sessionTitle || 'the session'}!`);
      fetchSessions();
    } catch (err) {
      setMsg(err.message || 'Failed to join social play session.');
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Friday Social Play" subtitle="Community tennis & badminton mixer games">
        <Loader message="Loading social play schedule..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Friday Social Play Sessions"
      subtitle="Join community doubles matches, mixer ladders, and friendly athletic scrimmages hosted by club coaches"
    >
      {msg && (
        <div style={{
          backgroundColor: '#d1fae5',
          border: '1px solid #6ee7b7',
          color: '#065f46',
          padding: '0.85rem 1rem',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle2 size={18} color="#059669" />
          <span>{msg}</span>
        </div>
      )}

      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #072a18 0%, #0F5132 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#ffffff',
        marginBottom: '2rem',
      }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          EVERY FRIDAY EVENING • ALL SKILL LEVELS WELCOME
        </span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '4px' }}>
          Social Mix-in Match Play & Ladder
        </h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.925rem', maxWidth: '720px', marginTop: '6px' }}>
          Meet fellow club members, play rotating doubles matches, and sharpen your game. Balls and refreshments provided. Complimentary for Gold members!
        </p>
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {sessions.map((s) => {
          const isJoined = joinedSessionIds.has(s.sessionId) || 
            (s.participants && s.participants.some((p) => 
              (user?.id && Number(p.memberId) === Number(user.id)) ||
              (user?.email && p.participantEmail && p.participantEmail.toLowerCase() === user.email.toLowerCase())
            ));
          const isFull = s.sessionStatus === 'FULL' || (s.currentParticipants >= s.maxParticipants);
          const rawStart = s.startTime ? (typeof s.startTime === 'string' && s.startTime.length >= 5 ? s.startTime.substring(0, 5) : String(s.startTime)) : '';
          const rawEnd = s.endTime ? (typeof s.endTime === 'string' && s.endTime.length >= 5 ? s.endTime.substring(0, 5) : String(s.endTime)) : '';

          return (
            <div
              key={s.sessionId}
              className="cs-card"
              style={{
                padding: '1.75rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isJoined ? '2px solid #10b981' : undefined,
                backgroundColor: isJoined ? '#f0fdf4' : undefined,
                transition: 'all 0.2s ease',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0F5132', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.court?.sportType || s.sportType || 'SPORTS'} SESSION
                  </span>
                  <Badge type={isJoined ? 'COMPLETED' : s.sessionStatus}>
                    {isJoined ? 'ENROLLED' : s.sessionStatus}
                  </Badge>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
                  {s.title || s.sessionTitle || 'Friday Social Play'}
                </h3>
                <p style={{ color: '#4b5563', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  {s.description || 'Rotating doubles ladder and recreational gameplay.'}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#374151', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} color="#0F5132" />
                    <span><strong>Date:</strong> {s.sessionDate}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} color="#0F5132" />
                    <span><strong>Hours:</strong> {rawStart} - {rawEnd}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Award size={16} color="#0F5132" />
                    <span><strong>Skill Level:</strong> {s.skillLevel || 'All Skill Levels Welcome'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={16} color="#0F5132" />
                    <span><strong>Capacity:</strong> {s.currentParticipants || 0} / {s.maxParticipants} players</span>
                  </div>
                </div>
              </div>

              {isJoined ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    border: '2px solid #a7f3d0',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'default',
                    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.1)',
                  }}
                >
                  <CheckCircle2 size={18} color="#059669" />
                  <span>Joined Session</span>
                </button>
              ) : isFull ? (
                <button
                  type="button"
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    backgroundColor: '#f1f5f9',
                    color: '#94a3b8',
                    border: '1px solid #cbd5e1',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'not-allowed',
                  }}
                >
                  Session Full
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleJoin(s)}
                  disabled={joiningId === s.sessionId}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {joiningId === s.sessionId ? 'Registering...' : 'Join Game Session'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};
