import React, { useState, useEffect } from 'react';
import { Globe, FileText, Video, Download, CheckCircle, Clock, AlertTriangle, Plus, X, Trash2, MessageSquare } from 'lucide-react';

const ContentCard = ({ title, status, date, observations, onDelete }) => {
    const statusColors = {
        'Publicado': { bg: '#C6F6D5', color: '#22543D' },
        'En curso': { bg: '#EBF8FF', color: '#2C5282' },
        'Planificado': { bg: '#FEFCBF', color: '#975A16' },
        'Detenido': { bg: '#FED7D7', color: '#C53030' }
    };

    const currentStatus = statusColors[status] || { bg: '#EDF2F7', color: '#4A5568' };

    return (
        <div className="card" style={{ marginBottom: '1rem', padding: '1.25rem', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', backgroundColor: '#F7FAFC', borderRadius: '8px', color: 'var(--color-primary)' }}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '600', color: '#2D3748', margin: 0 }}>{title}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#A0AEC0', marginTop: '0.25rem' }}>Añadido el {date}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '99px',
                        backgroundColor: currentStatus.bg,
                        color: currentStatus.color,
                        fontWeight: '700'
                    }}>
                        {status}
                    </span>
                    <button onClick={onDelete} style={{ background: 'none', border: 'none', color: '#CBD5E0', cursor: 'pointer', padding: '0.25rem' }} onMouseEnter={e => e.currentTarget.style.color = '#E53E3E'} onMouseLeave={e => e.currentTarget.style.color = '#CBD5E0'}>
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            {observations && (
                <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#F7FAFC', padding: '0.75rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                    <MessageSquare size={16} style={{ color: '#718096', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0, fontStyle: 'italic' }}>"{observations}"</p>
                </div>
            )}
        </div>
    );
};

export default function WebPlatform() {
    const [activeTab, setActiveTab] = useState('patients');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for contents
    const [patientsData, setPatientsData] = useState(() => {
        const saved = localStorage.getItem('web_patients_data');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Guía: Prevención de Caídas', status: 'Publicado', observations: 'Revisión final completada.', date: '02 Feb 2026' },
            { id: 2, title: 'Checklist: Medicación Segura', status: 'En curso', observations: 'Pendiente de validación por geriatría.', date: '28 Feb 2026' }
        ];
    });

    const [professionalsData, setProfessionalsData] = useState(() => {
        const saved = localStorage.getItem('web_professionals_data');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Protocolo de Conciliación', status: 'Publicado', observations: 'Implementado en todos los centros.', date: '15 Ene 2026' },
            { id: 2, title: 'Guía de Deprescripción', status: 'Planificado', observations: 'Inicio de redacción en Marzo.', date: '25 Feb 2026' }
        ];
    });

    const [formData, setFormData] = useState({
        task: '',
        status: 'Planificado',
        observations: ''
    });

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('web_patients_data', JSON.stringify(patientsData));
    }, [patientsData]);

    useEffect(() => {
        localStorage.setItem('web_professionals_data', JSON.stringify(professionalsData));
    }, [professionalsData]);

    const handleUpload = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            title: formData.task,
            status: formData.status,
            observations: formData.observations,
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
        };

        if (activeTab === 'patients') {
            setPatientsData([newItem, ...patientsData]);
        } else {
            setProfessionalsData([newItem, ...professionalsData]);
        }

        setIsModalOpen(false);
        setFormData({ task: '', status: 'Planificado', observations: '' });
    };

    const handleDelete = (id, tab) => {
        if (tab === 'patients') {
            setPatientsData(patientsData.filter(item => item.id !== id));
        } else {
            setProfessionalsData(professionalsData.filter(item => item.id !== id));
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', marginBottom: '0.5rem', fontWeight: '700', color: '#2D3748' }}>Plataforma Web Informativa</h1>
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
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'patients' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'patients' ? 'var(--color-primary)' : '#718096',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Educación a Pacientes
                </button>
                <button
                    onClick={() => setActiveTab('professionals')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'professionals' ? '2px solid var(--color-primary)' : '2px solid transparent',
                        color: activeTab === 'professionals' ? 'var(--color-primary)' : '#718096',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    Material Profesionales
                </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2D3748' }}>
                    {activeTab === 'patients' ? 'Recursos Educativos para Pacientes' : 'Material para Profesionales'}
                </h3>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        padding: '0.6rem 1.25rem',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Plus size={18} /> Subir Nuevo
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {activeTab === 'patients' ? (
                    patientsData.length > 0 ? (
                        patientsData.map(item => (
                            <ContentCard
                                key={item.id}
                                title={item.title}
                                status={item.status}
                                date={item.date}
                                observations={item.observations}
                                onDelete={() => handleDelete(item.id, 'patients')}
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#A0AEC0' }}>No hay recursos educativos registrados.</div>
                    )
                ) : (
                    professionalsData.length > 0 ? (
                        professionalsData.map(item => (
                            <ContentCard
                                key={item.id}
                                title={item.title}
                                status={item.status}
                                date={item.date}
                                observations={item.observations}
                                onDelete={() => handleDelete(item.id, 'professionals')}
                            />
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#A0AEC0' }}>No hay material profesional registrado.</div>
                    )
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A202C' }}>
                                Subir Nuevo {activeTab === 'patients' ? 'Recurso Educativo' : 'Material Profesional'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0AEC0' }}><X /></button>
                        </div>
                        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Tarea / Título del Elemento</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.task}
                                    onChange={e => setFormData({ ...formData, task: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem' }}
                                    placeholder="Ej. Guía de uso de inhaladores"
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Estado</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', backgroundColor: 'white' }}
                                >
                                    <option value="Planificado">Planificado</option>
                                    <option value="En curso">En curso</option>
                                    <option value="Detenido">Detenido</option>
                                    <option value="Publicado">Publicado</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Observaciones</label>
                                <textarea
                                    value={formData.observations}
                                    onChange={e => setFormData({ ...formData, observations: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', minHeight: '100px', fontFamily: 'inherit' }}
                                    placeholder="Añade detalles o notas adicionales..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#EDF2F7', color: '#4A5568', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                                <button type="submit" style={{ flex: 2, backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Subir Elemento</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
