import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { Shield, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Key, ArrowRight } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email Request, 2: OTP + New Password, 3: Success

  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [devOtp, setDevOtp] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authService.requestPasswordReset({ email });
      if (res.devOtp) setDevOtp(res.devOtp);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset with OTP
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 10) {
      setError('Password must be at least 10 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPasswordWithOtp({
        email,
        otpCode: otpCode.trim(),
        newPassword,
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
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
      padding: '2rem 1.5rem',
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        padding: '2.5rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            margin: '0 auto 0.75rem',
            background: 'linear-gradient(135deg, #198754, #0F5132)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 6px 15px rgba(15, 81, 50, 0.25)',
          }}>
            <Shield size={26} color="#D4AF37" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0F5132', letterSpacing: '-0.02em', margin: 0 }}>
            Account Password Recovery
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '4px' }}>
            {step === 1 && 'Enter your registered email to receive a 6-digit OTP code'}
            {step === 2 && `Enter the 6-digit OTP sent to ${email}`}
            {step === 3 && 'Password successfully updated!'}
          </p>
        </div>

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

        {/* Step 1: Request OTP */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Registered Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.4rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
                <Mail size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              </div>
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
              }}
            >
              <span>{loading ? 'Sending Code...' : 'Request Password Reset OTP'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* Step 2: OTP + New Password */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
            {devOtp && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px dashed #d97706',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 700 }}>
                  Dev OTP: <strong>{devOtp}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode(devOtp)}
                  style={{ backgroundColor: '#ffffff', border: '1px solid #d97706', color: '#b45309', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  Autofill
                </button>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                6-Digit Recovery OTP *
              </label>
              <input
                type="text"
                maxLength={6}
                required
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '2px solid #0F5132', fontSize: '1.25rem', letterSpacing: '0.2em', textAlign: 'center', fontWeight: 800 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                New Password (Min 10 chars) *
              </label>
              <input
                type="password"
                required
                minLength={10}
                placeholder="••••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                minLength={10}
                placeholder="••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password & Return'}
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
              Password Changed!
            </h3>
            <p style={{ color: '#4b5563', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              Your password has been successfully updated. You may now log in with your new credentials.
            </p>
            <Link
              to="/login"
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#0F5132',
                color: '#ffffff',
                padding: '0.85rem',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.95rem',
                textDecoration: 'none',
              }}
            >
              Sign In to Your Account
            </Link>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#0F5132', fontWeight: 700, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
};
