import React, { useState, useEffect } from 'react';
import { Plus, GraduationCap, Video, FileText, CheckCircle, Trash2, X } from 'lucide-react';

export default function PatientEducation() {
    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem('educationData');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Taller de Adherencia Terapéutica', type: 'Presencial', date: '12 Mar 2026' }
        ];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', type: 'Material Digital', date: '' });

    useEffect(() => {
        localStorage.setItem('educationData', JSON.stringify(activities));
    }, [activities]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setActivities(prev => [...prev, { id: Date.now(), ...formData }]);
        setIsModalOpen(false);
        setFormData({ name: '', type: 'Material Digital', date: '' });
    };

    const handleDelete = (id) => {
        setActivities(prev => prev.filter(a => a.id !== id));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748' }}>Educación a Pacientes</h1>
                    <p style={{ color: '#718096' }}>Repositorio y planificación de actividades formativas.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    <Plus size={20} /> Nueva Actividad
                </button>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {activities.map(activity => (
                    <div key={activity.id} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between' }}>
                            <div style={{ padding: '0.75rem', backgroundColor: '#F0FFF4', borderRadius: '12px', color: '#38A169' }}>
                                {activity.type.includes('Video') ? <Video /> : <GraduationCap />}
                            </div>
                            <button onClick={() => handleDelete(activity.id)} style={{ color: '#E2E8F0', cursor: 'pointer', border: 'none', background: 'none' }} onMouseEnter={e => e.target.style.color = '#E53E3E'} onMouseLeave={e => e.target.style.color = '#E2E8F0'}>
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#718096', fontWeight: '600', letterSpacing: '0.05em' }}>{activity.type}</span>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: '#2D3748', marginTop: '0.25rem' }}>{activity.name}</h3>
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #EDF2F7', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#718096', fontSize: '0.875rem' }}>
                            <span>{activity.date || 'Sin fecha'}</span>
                            <button style={{ color: 'var(--color-primary)', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer' }}>Ver detalles</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Nueva Actividad Educativa</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Nombre de la Actividad</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }} placeholder="Ej. Webinar sobre Diabetes" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Tipo</label>
                                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                                    <option value="Material Digital">Material Digital (PDF/Web)</option>
                                    <option value="Video / Multimedia">Video / Multimedia</option>
                                    <option value="Taller Presencial">Taller Presencial</option>
                                    <option value="Webinar Online">Webinar Online</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Fecha (Opcional)</label>
                                <input type="text" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }} placeholder="Ej. 25 Mar 2026" />
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Crear Actividad</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
