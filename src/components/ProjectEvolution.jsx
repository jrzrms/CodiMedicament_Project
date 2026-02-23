import React, { useState, useEffect } from 'react';
import { Trophy, Clock, CheckCircle2, Milestone, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react';

export default function ProjectEvolution() {
    const [milestones, setMilestones] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('projectEvolution');
        if (saved) {
            setMilestones(JSON.parse(saved).sort((a, b) => new Date(b.date) - new Date(a.date)));
        }
    }, []);

    const getGroupColor = (item) => {
        // Fallback colors for evolution timeline
        const colors = {
            '1': '#ECC94B',
            '2': '#F56565',
            '3': '#48BB78',
            '4': '#DD6B20',
            '5': '#ED64A6',
            '6': '#805AD5',
            '7': '#38B2AC',
            '8': '#D69E2E',
            '9': '#667EEA'
        };
        const firstChar = item.groupTitle ? item.groupTitle.charAt(0) : '0';
        return colors[firstChar] || 'var(--color-primary)';
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '8px' }}>
                        <TrendingUp size={24} color="var(--color-primary)" />
                    </div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748' }}>Evolución del Proyecto</h1>
                </div>
                <p style={{ color: '#718096' }}>Registro longitudinal de hitos y logros alcanzados.</p>
            </header>

            {milestones.length > 0 ? (
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    {/* Vertical Line */}
                    <div style={{
                        position: 'absolute',
                        left: '7px',
                        top: '10px',
                        bottom: '10px',
                        width: '2px',
                        backgroundColor: '#E2E8F0'
                    }}></div>

                    {milestones.map((milestone, index) => (
                        <div key={milestone.id} style={{
                            position: 'relative',
                            marginBottom: '2.5rem',
                            animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
                        }}>
                            {/* Dot */}
                            <div style={{
                                position: 'absolute',
                                left: '-27px',
                                top: '5px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                border: `3px solid ${getGroupColor(milestone)}`,
                                zIndex: 1
                            }}></div>

                            <div style={{
                                backgroundColor: 'white',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                border: '1px solid #E2E8F0',
                                transition: 'transform 0.2s',
                                cursor: 'default'
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '700',
                                            color: getGroupColor(milestone),
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            {milestone.groupTitle}
                                        </span>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#2D3748', marginTop: '0.25rem' }}>
                                            {milestone.taskName}
                                        </h3>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontSize: '0.8rem',
                                        color: '#718096',
                                        backgroundColor: '#F7FAFC',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '99px'
                                    }}>
                                        <Calendar size={14} />
                                        {new Date(milestone.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                        fontSize: '0.85rem',
                                        color: '#48BB78',
                                        fontWeight: '600'
                                    }}>
                                        <Trophy size={16} />
                                        Hito Completado
                                    </div>
                                    <div style={{ width: '1px', height: '12px', backgroundColor: '#E2E8F0' }}></div>
                                    <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                                        Responsable: <strong>{milestone.owner}</strong>
                                    </div>
                                </div>

                                {milestone.metric && milestone.metric !== '-' && (
                                    <div style={{
                                        marginTop: '1rem',
                                        padding: '0.75rem',
                                        backgroundColor: '#F0FFF4',
                                        borderRadius: '6px',
                                        fontSize: '0.85rem',
                                        color: '#2F855A',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <ArrowUpRight size={14} />
                                        Impacto: {milestone.metric}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{
                    textAlign: 'center',
                    padding: '5rem 2rem',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    border: '1px dashed #CBD5E0'
                }}>
                    <Milestone size={64} color="#CBD5E0" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.25rem', color: '#4A5568', marginBottom: '0.5rem' }}>Aún no hay hitos registrados</h3>
                    <p style={{ color: '#718096' }}>Los logros aparecerán aquí automáticamente conforme completes tareas en el Panel Principal.</p>
                </div>
            )}

            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-10px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                `}
            </style>
        </div>
    );
}
