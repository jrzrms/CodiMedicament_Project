import React from 'react';
import ecosystemImage from '../assets/ecosistema_v5.jpg';

export default function Ecosystem() {
    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', height: 'calc(100vh - 4rem)' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', fontWeight: '700', color: '#2D3748' }}>Mapa del Ecosistema</h1>
                <p style={{ color: '#718096' }}>Visión global de interconexiones y flujo de valor del proyecto Codi Medicament.</p>
            </header>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                padding: '2rem',
                height: 'calc(100% - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <img
                    src={ecosystemImage}
                    alt="Ecosistema Codi Medicament"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '0.5rem'
                    }}
                />
            </div>
        </div>
    );
}
