import React from 'react';
import procesoImage from '../assets/proceso_cm.png';

export default function ProcesoCM() {
    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', height: 'calc(100vh - 4rem)' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', fontWeight: '700', color: '#2D3748' }}>Proceso Codi Medicament</h1>
                <p style={{ color: '#718096' }}>Diagrama de flujo completo del programa: Desde la sospecha hasta el seguimiento domiciliario.</p>
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
                    src={procesoImage}
                    alt="Proceso Codi Medicament"
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
