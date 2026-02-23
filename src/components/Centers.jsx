import React, { useState, useEffect } from 'react';
import { Plus, Search, Building2, MapPin, MoreHorizontal, Trash2, Edit2, X } from 'lucide-react';

const STATUS_CONFIG = {
    'Interesado': { bg: '#FEFCBF', color: '#D69E2E', label: 'Interesado' },
    'Pendiente': { bg: '#E9D8FD', color: '#805AD5', label: 'Acreditación Pdte.' },
    'Activo': { bg: '#C6F6D5', color: '#38A169', label: 'Activo' },
    'Inactivo': { bg: '#FED7D7', color: '#E53E3E', label: 'Inactivo' }
};

export default function Centers() {
    const [centers, setCenters] = useState(() => {
        const saved = localStorage.getItem('centersData');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Hospital de Sant Pau', status: 'Activo', loc: 'Barcelona' }
        ];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', status: 'Interesado', loc: '' });

    useEffect(() => {
        localStorage.setItem('centersData', JSON.stringify(centers));
    }, [centers]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setCenters(prev => [...prev, { id: Date.now(), ...formData }]);
        setIsModalOpen(false);
        setFormData({ name: '', status: 'Interesado', loc: '' });
    };

    const handleDelete = (id) => {
        setCenters(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748' }}>Captación de Centros</h1>
                    <p style={{ color: '#718096' }}>Gestión y seguimiento de centros adheridos al ecosistema.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                >
                    <Plus size={20} /> Nuevo Centro
                </button>
            </header>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1fr 100px', padding: '1rem 1.5rem', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F7FAFC', fontWeight: '600', color: '#4A5568', fontSize: '0.875rem' }}>
                    <div>Nombre del Centro</div>
                    <div>Ubicación</div>
                    <div>Estado</div>
                    <div style={{ textAlign: 'center' }}>Acciones</div>
                </div>

                {centers.map(center => (
                    <div key={center.id} style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 2fr) 1fr 1fr 100px', padding: '1.25rem 1.5rem', borderBottom: '1px solid #EDF2F7', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '600', color: '#2D3748' }}>
                            <div style={{ padding: '0.5rem', backgroundColor: '#EBF4FF', borderRadius: '8px', color: '#4299E1' }}>
                                <Building2 size={20} />
                            </div>
                            {center.name}
                        </div>
                        <div style={{ color: '#718096', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={16} />
                            {center.loc || '-'}
                        </div>
                        <div>
                            <span style={{
                                backgroundColor: STATUS_CONFIG[center.status]?.bg || '#EDF2F7',
                                color: STATUS_CONFIG[center.status]?.color || '#4A5568',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '99px',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }}>
                                {STATUS_CONFIG[center.status]?.label || center.status}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button onClick={() => handleDelete(center.id)} style={{ padding: '0.5rem', color: '#CBD5E0', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = '#E53E3E'} onMouseLeave={e => e.target.style.color = '#CBD5E0'}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {centers.length === 0 && (
                    <div style={{ padding: '4rem', textAlign: 'center', color: '#A0AEC0' }}>
                        No hay centros registrados.
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Añadir Nuevo Centro</h2>
                            <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Nombre del Centro</label>
                                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }} placeholder="Ej. Hospital Clínic" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Ubicación</label>
                                <input type="text" value={formData.loc} onChange={e => setFormData({ ...formData, loc: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }} placeholder="Ciudad / Provincia" />
                            </div>
                            <div>
                                <label style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4A5568', marginBottom: '0.5rem', display: 'block' }}>Estado</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                                    <option value="Interesado">Interesado</option>
                                    <option value="Pendiente">Acreditación Pendiente</option>
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <button type="submit" style={{ marginTop: '1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Centro</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
