import React, { useState, useEffect } from 'react';
import { Plus, Building2, Trash2, X, MessageSquare, Briefcase } from 'lucide-react';

export default function ProfessionalsMaterial() {
    const [materials, setMaterials] = useState(() => {
        const saved = localStorage.getItem('web_professionals_data');
        return saved ? JSON.parse(saved) : [
            { id: 1, title: 'Protocolo de Conciliación', status: 'Publicado', observations: 'Implementado en todos los centros.', date: '15 Ene 2026' }
        ];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ task: '', status: 'Planificado', observations: '' });

    useEffect(() => {
        localStorage.setItem('web_professionals_data', JSON.stringify(materials));
    }, [materials]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newItem = {
            id: Date.now(),
            title: formData.task,
            status: formData.status,
            observations: formData.observations,
            date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
        };
        setMaterials([newItem, ...materials]);
        setIsModalOpen(false);
        setFormData({ task: '', status: 'Planificado', observations: '' });
    };

    const handleDelete = (id) => {
        setMaterials(materials.filter(m => m.id !== id));
    };

    const statusColors = {
        'Publicado': { bg: '#C6F6D5', color: '#22543D' },
        'En curso': { bg: '#EBF8FF', color: '#2C5282' },
        'Planificado': { bg: '#FEFCBF', color: '#975A16' },
        'Detenido': { bg: '#FED7D7', color: '#C53030' }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748' }}>Material Profesionales</h1>
                    <p style={{ color: '#718096' }}>Repositorio de protocolos y guías para el personal sanitario.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center',
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Plus size={20} /> Subir Nuevo
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {materials.map(material => {
                    const statusStyle = statusColors[material.status] || { bg: '#EDF2F7', color: '#4A5568' };
                    return (
                        <div key={material.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                                <div style={{ padding: '0.75rem', backgroundColor: '#EBF8FF', borderRadius: '12px', color: '#3182CE' }}>
                                    <Briefcase size={24} />
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px',
                                        backgroundColor: statusStyle.bg,
                                        color: statusStyle.color,
                                        fontWeight: '700'
                                    }}>
                                        {material.status}
                                    </span>
                                    <button onClick={() => handleDelete(material.id)} style={{ color: '#E2E8F0', cursor: 'pointer', border: 'none', background: 'none', padding: '0.25rem' }} onMouseEnter={e => e.currentTarget.style.color = '#E53E3E'} onMouseLeave={e => e.currentTarget.style.color = '#E2E8F0'}>
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2D3748', marginTop: '0.25rem' }}>{material.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#718096', marginTop: '0.25rem' }}>Añadido el {material.date}</p>
                            </div>

                            {material.observations && (
                                <div style={{ backgroundColor: '#F7FAFC', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #CBD5E0' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: 0, fontStyle: 'italic' }}>
                                        {material.observations}
                                    </p>
                                </div>
                            )}

                            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #EDF2F7', display: 'flex', justifyContent: 'flex-end' }}>
                                <button style={{ color: 'var(--color-primary)', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.875rem' }}>Ver detalles</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A202C' }}>Nuevo Material Profesional</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0AEC0' }}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Tarea / Título</label>
                                <input required type="text" value={formData.task} onChange={e => setFormData({ ...formData, task: e.target.value })} style={{ width: '100%', padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem' }} placeholder="Ej. Guía de Interacciones" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Estado</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', backgroundColor: 'white' }}>
                                    <option value="Planificado">Planificado</option>
                                    <option value="En curso">En curso</option>
                                    <option value="Detenido">Detenido</option>
                                    <option value="Publicado">Publicado</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Observaciones</label>
                                <textarea value={formData.observations} onChange={e => setFormData({ ...formData, observations: e.target.value })} style={{ width: '100%', padding: '0.875rem', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '1rem', minHeight: '120px', fontFamily: 'inherit' }} placeholder="Detalles sobre el material..." />
                            </div>
                            <button type="submit" style={{ marginTop: '0.5rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '1rem', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>Subir Nuevo Material</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
