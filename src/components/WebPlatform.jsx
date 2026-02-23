import React, { useState } from 'react';
import { Globe, FileText, Video, Download, CheckCircle, Clock, AlertTriangle, MapPin } from 'lucide-react';

const ContentCard = ({ title, type, status, views, date }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: type === 'video' ? '#EBF8FF' : '#F0FFF4', borderRadius: '0.5rem', color: type === 'video' ? '#3182CE' : '#38A169' }}>
                {type === 'video' ? <Video size={20} /> : <FileText size={20} />}
            </div>
            <div>
                <p style={{ fontWeight: '500', color: '#2D3748' }}>{title}</p>
                <p style={{ fontSize: '0.75rem', color: '#718096' }}>{date} • {views} descargas/vistas</p>
            </div>
        </div>
        <div>
            <span style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                backgroundColor: status === 'Publicado' ? '#C6F6D5' : '#FEFCBF',
                color: status === 'Publicado' ? '#22543D' : '#975A16',
                fontWeight: '600'
            }}>
                {status}
            </span>
        </div>
    </div>
);

const CenterStatus = ({ name, phase, progress, status }) => (
    <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <MapPin size={20} color="#6B46C1" />
                <h3 style={{ fontWeight: '600', color: '#2D3748' }}>{name}</h3>
            </div>
            <span style={{ fontSize: '0.875rem', color: status === 'Active' ? '#48BB78' : '#ECC94B', fontWeight: 'bold' }}>
                {status === 'Active' ? 'Activo' : 'En Proceso'}
            </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#718096' }}>
            <span style={{ minWidth: '120px' }}>Fase: <strong>{phase}</strong></span>
            <div style={{ flex: 1, height: '8px', backgroundColor: '#EDF2F7', borderRadius: '4px' }}>
                <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#6B46C1', borderRadius: '4px' }}></div>
            </div>
            <span>{progress}%</span>
        </div>
    </div>
);

export default function WebPlatform() {
    const [activeTab, setActiveTab] = useState('patients');

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem' }}>Plataforma Web Informativa</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>Gestión de contenidos: codimedicament.santpau.cat</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#C6F6D5', borderRadius: '0.5rem', color: '#22543D' }}>
                    <Globe size={18} />
                    <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>Online v2.4</span>
                </div>
            </header>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #E2E8F0' }}>
                <button
                    onClick={() => setActiveTab('patients')}
                    style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', borderBottom: activeTab === 'patients' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'patients' ? 'var(--color-primary)' : '#718096', fontWeight: '600', cursor: 'pointer' }}
                >
                    Educación a Pacientes
                </button>
                <button
                    onClick={() => setActiveTab('centers')}
                    style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', borderBottom: activeTab === 'centers' ? '2px solid var(--color-primary)' : '2px solid transparent', color: activeTab === 'centers' ? 'var(--color-primary)' : '#718096', fontWeight: '600', cursor: 'pointer' }}
                >
                    Captación de Centros
                </button>
            </div>

            {activeTab === 'patients' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Recursos Educativos</h3>
                        <button style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '0.375rem', cursor: 'pointer' }}>+ Subir Nuevo</button>
                    </div>

                    <ContentCard title="Guía: Prevención de Caídas" type="file" status="Publicado" date="02 Feb 2026" views={1240} />
                    <ContentCard title="Video: Uso seguro de Opioides" type="video" status="Publicado" date="28 Ene 2026" views={856} />
                    <ContentCard title="Infografía: Semáforo de Fármacos" type="file" status="Revisión Clínica" date="07 Feb 2026" views={0} />
                    <ContentCard title="Tríptico: Alta Hospitalaria" type="file" status="Publicado" date="15 Ene 2026" views={2100} />
                </div>
            )}

            {activeTab === 'centers' && (
                <div>
                    <div style={{ backgroundColor: '#EBF8FF', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
                        <h3 style={{ color: '#2C5282', fontWeight: '600', marginBottom: '0.5rem' }}>Funnel de Adhesión</h3>
                        <p style={{ fontSize: '0.875rem', color: '#4299E1', marginBottom: '1rem' }}>Estado de integración de los centros en la plataforma web.</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>4</span>
                                <span style={{ fontSize: '0.75rem', color: '#718096' }}>Activos</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>2</span>
                                <span style={{ fontSize: '0.75rem', color: '#718096' }}>En Validación</span>
                            </div>
                            <div style={{ flex: 1, textAlign: 'center', padding: '1rem', backgroundColor: 'white', borderRadius: '0.375rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#2D3748' }}>5</span>
                                <span style={{ fontSize: '0.75rem', color: '#718096' }}>Potenciales</span>
                            </div>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Centros Vinculados</h3>
                    <CenterStatus name="Hospital de Sant Pau" phase="Despliegue Total" progress={100} status="Active" />
                    <CenterStatus name="Consorci Sanitari de Terrassa (CST)" phase="Integración SIRE" progress={75} status="Active" />
                    <CenterStatus name="Hospital Dos de Maig" phase="Formación Personal" progress={45} status="Onboarding" />
                    <CenterStatus name="Hospital de Granollers" phase="Acuerdo Marco" progress={20} status="Onboarding" />
                </div>
            )}
        </div>
    );
}
