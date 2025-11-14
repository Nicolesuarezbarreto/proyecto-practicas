import React from 'react';

export default function Header({ onCreate = () => {}, onLogout = () => {}, authenticated = false }) {
  return (
    <header className="header">
      <div className="container row" style={{ alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(90deg, var(--primary), var(--accent))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
          }}>
            C
          </div>
          <h1 style={{ margin: 0, fontSize: '1.1rem' }}>Cartelera</h1>
        </div>

        <div className="spacer" />

        <div className="row" style={{ gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Explorar</button>

          {/* El botón Crear evento está siempre visible (como pediste).
              Si el usuario no está autenticado, App abre el modal de login cuando se hace click.
          */}
          <button className="btn btn-primary" onClick={() => onCreate()}>Crear evento</button>

          {authenticated ? (
            <button className="btn btn-ghost" onClick={() => onLogout()}>Cerrar sesión</button>
          ) : (
            <button className="btn btn-ghost" onClick={() => onCreate()}>Ingresar</button>
          )}
        </div>
      </div>
    </header>
  );
}
