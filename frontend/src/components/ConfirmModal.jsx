import React from 'react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', confirmVariant = 'primary' }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        className="card"
        style={{
          width: '90%',
          maxWidth: '440px',
          padding: '24px',
          margin: 0,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '8px' }}>
          {title}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '24px', lineHeight: 1.5 }}>
          {message}
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
