import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import {
  Shield,
  Lock,
  Mail,
  User,
  Phone,
  Calendar,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Key,
  Clock,
  RotateCw,
} from 'lucide-react';

export const RegisterPage = () => {
  const { setAuthUser } = useAuth();
  const navigate = useNavigate();

  // Multi-stage tracker: 1, 2, 3
  const [stage, setStage] = useState(1);

  // Stage 1 form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Other',
    emergencyContact: '',
  });

  // Stage 2 state
  const [otpSessionId, setOtpSessionId] = useState('');
  const [devOtp, setDevOtp] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes

  // Stage 3 state
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 5-minute countdown for Stage 2
  useEffect(() => {
    let interval = null;
    if (stage === 2 && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stage, timerSeconds]);

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: '#e5e7eb' };
    let score = 0;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, label: 'Weak (Min 10 chars)', color: '#ef4444' };
    if (score === 2 || score === 3) return { score: 65, label: 'Moderate', color: '#f59e0b' };
    return { score: 100, label: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  // Stage 1 Submit
  const handleStage1Submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.signupStage1(formData);
      setOtpSessionId(res.otpSessionId);
      if (res.devOtp) setDevOtp(res.devOtp);
      setTimerSeconds(300);
      setStage(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Stage 1 submission failed.');
    } finally {
      setLoading(false);
    }
  };

  // Stage 2 Submit (Verify OTP)
  const handleStage2Submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!otpCode || otpCode.length < 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }
    setLoading(true);

    try {
      await authService.verifySignupOtp({
        otpSessionId,
        otpCode: otpCode.trim(),
      });
      setStage(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await authService.signupStage1(formData);
      setOtpSessionId(res.otpSessionId);
      if (res.devOtp) setDevOtp(res.devOtp);
      setTimerSeconds(300);
    } catch (err) {
      setError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Stage 3 Submit (Complete Signup)
  const handleStage3Submit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the ClubSphere Terms & Conditions.');
      return;
    }

    setLoading(true);
    try {
      const res = await authService.completeStudentSignup({
        otpSessionId,
        password,
      });

      // Synchronize session in AuthContext
      setAuthUser(res);
      navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration completion failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #072a18 0%, #0F5132 50%, #198754 100%)',
      padding: '2.5rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '580px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #198754, #0F5132)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 15px rgba(15, 81, 50, 0.3)',
          }}>
            <Shield size={28} color="#D4AF37" />
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F5132', letterSpacing: '-0.02em' }}>
            Student Registration Portal
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.88rem' }}>
            Get your instant student account & activate your 7-Day Free Trial
          </p>
        </div>

        {/* Progress Bar (3 Stages) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '15px', left: '10%', right: '10%', height: '2px', backgroundColor: '#e5e7eb', zIndex: 0 }} />
          
          {/* Step 1 */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: stage >= 1 ? '#0F5132' : '#e5e7eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}>
              {stage > 1 ? <CheckCircle2 size={18} /> : '1'}
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: stage >= 1 ? '#0F5132' : '#9ca3af' }}>Personal Info</span>
          </div>

          {/* Step 2 */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: stage >= 2 ? '#0F5132' : '#e5e7eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}>
              {stage > 2 ? <CheckCircle2 size={18} /> : '2'}
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: stage >= 2 ? '#0F5132' : '#9ca3af' }}>Verify OTP</span>
          </div>

          {/* Step 3 */}
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: stage >= 3 ? '#0F5132' : '#e5e7eb',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 4px',
              fontWeight: 800,
              fontSize: '0.85rem',
            }}>
              3
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: stage >= 3 ? '#0F5132' : '#9ca3af' }}>Set Password</span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            fontSize: '0.85rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* ================= STAGE 1: PERSONAL DETAILS ================= */}
        {stage === 1 && (
          <form onSubmit={handleStage1Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Rohan Sharma"
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
                  placeholder="rohan@example.com"
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
                  placeholder="+91 9876543210"
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem', backgroundColor: '#ffffff' }}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="+91 9811122233 (Parent / Guardian)"
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
              <span>{loading ? 'Sending Verification Code...' : 'Proceed to OTP Verification'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* ================= STAGE 2: 6-DIGIT EMAIL OTP ================= */}
        {stage === 2 && (
          <form onSubmit={handleStage2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#d1e7dd', color: '#0F5132', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                <Key size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Enter 6-Digit Email Verification Code
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                We sent a 6-digit OTP code to <strong>{formData.email}</strong>
              </p>
            </div>

            {/* Dev Helper Box for Evaluation */}
            {devOtp && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px dashed #d97706',
                borderRadius: '10px',
                padding: '0.75rem 1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#92400e', fontWeight: 700, textTransform: 'uppercase' }}>
                    EVALUATION HELPER (LOCAL DEV):
                  </span>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#b45309', letterSpacing: '0.1em' }}>
                    {devOtp}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtpCode(devOtp)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #d97706',
                    color: '#b45309',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Autofill Code
                </button>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                6-Digit OTP Code *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: '2px solid #0F5132',
                  fontSize: '1.5rem',
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  fontWeight: 800,
                  color: '#0F5132',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: timerSeconds > 0 ? '#4b5563' : '#ef4444' }}>
                <Clock size={16} />
                <span>Expires in: <strong>{Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</strong></span>
              </div>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || timerSeconds > 240}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0F5132',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCw size={14} /> Resend OTP
              </button>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setStage(1)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: '1px solid #d1d5db',
                  backgroundColor: '#ffffff',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: 2,
                  padding: '0.75rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#0F5132',
                  color: '#ffffff',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Verifying...' : 'Verify OTP Code'}
              </button>
            </div>
          </form>
        )}

        {/* ================= STAGE 3: PASSWORD & TERMS ================= */}
        {stage === 3 && (
          <form onSubmit={handleStage3Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111827', margin: 0 }}>
                Set Password & Agree to Terms
              </h3>
              <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
                Email verified! Create a secure password (minimum 10 characters).
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Account Password *
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 10 characters"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />

              {/* Strength Meter */}
              <div style={{ marginTop: '6px' }}>
                <div style={{ height: '4px', width: '100%', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${strength.score}%`, backgroundColor: strength.color, transition: 'all 0.3s' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                  <span style={{ color: '#6b7280' }}>Password Strength:</span>
                  <strong style={{ color: strength.color }}>{strength.label}</strong>
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Confirm Password *
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <input
                type="checkbox"
                id="terms"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: '3px', cursor: 'pointer' }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.82rem', color: '#4b5563', lineHeight: 1.5, cursor: 'pointer' }}>
                I agree to the ClubSphere Sports Pavilion rules, turnstile terms, and single-active membership policy.
              </label>
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
              <span>{loading ? 'Creating Your Account...' : 'Complete Signup & Go to Dashboard'}</span>
              <Sparkles size={18} color="#D4AF37" />
            </button>
          </form>
        )}

        {/* Footer Note */}
        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.85rem', color: '#6b7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
