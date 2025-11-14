import React from 'react';

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2,6,23,0.5)',
      zIndex: 1200
    }}>
      <div style={{
        width: 'min(760px, 95%)',
        background: 'var(--card)',
        borderRadius: 12,
        padding: 18,
        boxShadow: '0 12px 40px rgba(2,6,23,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
        <div style={{ marginTop: 12 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
