import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

export default function Kanban() {
    const [priorityTasks, setPriorityTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const refreshTasks = useCallback(() => {
        setIsRefreshing(true);
        
        // Simular un pequeño delay para feedback visual
        setTimeout(() => {
            // 1. Load data
            const saved = localStorage.getItem('dashboardGroups');
            if (!saved) {
                setIsRefreshing(false);
                return;
            }

            const groups = JSON.parse(saved);
            const flattened = [];

            // 2. Flatten and Parse
            groups.forEach(group => {
                group.items.forEach(item => {
                    // Solo tareas no finalizadas
                    if (item.status === 'Done') return;

                    const dateScore = parseDateScore(item.metric);
                    flattened.push({
                        ...item,
                        groupTitle: group.title,
                        groupColor: group.color,
                        dateScore: dateScore // Menor es más pronto
                    });
                });
            });

            // 3. Sort by: 1. Alerts, 2. Date Score, 3. Status (Stuck first)
            flattened.sort((a, b) => {
                // Alertas primero
                if (a.alert && !b.alert) return -1;
                if (!a.alert && b.alert) return 1;

                // Tareas detenidas (Stuck) tienen prioridad sobre el resto
                if (a.status === 'Stuck' && b.status !== 'Stuck') return -1;
                if (a.status !== 'Stuck' && b.status === 'Stuck') return 1;

                // Luego por fecha
                return a.dateScore - b.dateScore;
            });

            // 4. Take Top 5
            setPriorityTasks(flattened.slice(0, 5));
            setAllTasks(flattened);
            setIsRefreshing(false);
        }, 600);
    }, []);

    useEffect(() => {
        refreshTasks();
    }, [refreshTasks]);

    // Helper to parse dates like "15 Feb", "Deadline 12 Mar"
    const parseDateScore = (text) => {
        if (!text || text === '-' || text === 'Pendiente' || text === 'Retraso') {
            // Si tiene alerta pero no fecha, ponerlo muy arriba (pero después de fechas reales pasadas)
            return 9999999999999;
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const months = {
            'ene': 0, 'jan': 0, 'feb': 1, 'mar': 2, 'abr': 3, 'apr': 3,
            'may': 4, 'jun': 5, 'jul': 6, 'ago': 7, 'aug': 7, 'sep': 8,
            'oct': 9, 'nov': 10, 'dic': 11, 'dec': 11
        };

        const lower = text.toLowerCase();
        let monthIndex = -1;
        for (const [m, idx] of Object.entries(months)) {
            if (lower.includes(m)) {
                monthIndex = idx;
                break;
            }
        }

        if (monthIndex === -1) return 9999999999999;

        const digits = lower.match(/\d+/);
        const day = digits ? parseInt(digits[0]) : 1;
        const date = new Date(currentYear, monthIndex, day);

        return date.getTime();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Working': return '#FDAB3D';
            case 'Stuck': return '#E2445C';
            case 'Future': return '#579BFC';
            default: return '#CBD5E0';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'Working': return 'En curso';
            case 'Stuck': return 'Detenido';
            case 'Future': return 'Planificado';
            default: return status;
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748', marginBottom: '0.5rem' }}>Tablero de Trabajo Semanal</h1>
                    <p style={{ color: '#718096' }}>Foco en las 5 tareas prioritarias según estado y fechas de entrega.</p>
                </div>
                
                <button 
                    onClick={refreshTasks}
                    disabled={isRefreshing}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 1.2rem',
                        backgroundColor: isRefreshing ? '#EDF2F7' : 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        color: '#4A5568',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        cursor: isRefreshing ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                        outline: 'none'
                    }}
                    onMouseEnter={(e) => {
                        if(!isRefreshing) {
                            e.currentTarget.style.backgroundColor = '#F7FAFC';
                            e.currentTarget.style.borderColor = '#CBD5E0';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if(!isRefreshing) {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.borderColor = '#E2E8F0';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                        }
                    }}
                >
                    <RefreshCw 
                        size={18} 
                        style={{ 
                            animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                            color: 'var(--color-primary)'
                        }} 
                    />
                    {isRefreshing ? 'Actualizando...' : 'Actualizar Tareas'}
                </button>
            </header>

            <style>
                {`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .priority-card {
                    transition: all 0.3s ease;
                }
                .priority-card:hover {
                    transform: translateX(8px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
                }
                `}
            </style>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {priorityTasks.length > 0 ? priorityTasks.map((task, index) => (
                    <div key={task.id} className="priority-card" style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        borderLeft: `6px solid ${task.groupColor}`,
                        opacity: isRefreshing ? 0.6 : 1,
                        transform: isRefreshing ? 'scale(0.98)' : 'scale(1)',
                        transition: 'all 0.4s ease'
                    }}>
                        <div style={{
                            fontSize: '2rem',
                            fontWeight: '800',
                            color: '#E2E8F0',
                            marginRight: '1.5rem',
                            width: '40px'
                        }}>
                            {index + 1}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem' }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '700',
                                    color: task.groupColor,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {task.groupTitle.includes('.') ? task.groupTitle.split('.')[1].trim() : task.groupTitle}
                                </span>
                                {task.alert && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#E2445C', fontWeight: '700', backgroundColor: '#FFF5F5', padding: '2px 8px', borderRadius: '4px' }}><AlertCircle size={12} /> ALTA PRIORIDAD</span>}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2D3748', marginBottom: '0.5rem' }}>{task.name}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Calendar size={16} color={task.metric.includes('Deadline') || task.alert ? '#E2445C' : '#718096'} />
                                    <span style={{ fontWeight: task.metric.includes('Deadline') || task.alert ? '600' : '400' }}>{task.metric}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(task.status) }}></div>
                                    {getStatusLabel(task.status)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Clock size={16} />
                                    Responsable: <span style={{ fontWeight: '600', color: '#4A5568' }}>{task.owner}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button style={{
                                padding: '0.75rem',
                                borderRadius: '50%',
                                backgroundColor: '#EDF2F7',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#4A5568',
                                transition: 'all 0.2s'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                    e.currentTarget.style.color = 'white';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#EDF2F7';
                                    e.currentTarget.style.color = '#4A5568';
                                }}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#A0AEC0', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5, color: '#48BB78' }} />
                        <p style={{ fontSize: '1.1rem' }}>No hay tareas pendientes prioritarias.</p>
                        <p style={{ fontSize: '0.9rem' }}>¡Buen trabajo! Todo está bajo control.</p>
                    </div>
                )}
            </div>

            {/* Resumen Section */}
            <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ fontWeight: '600', color: '#4A5568', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '4px', height: '16px', backgroundColor: 'var(--color-primary)', borderRadius: '2px' }}></div>
                    Estado General de Operaciones
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem' }}>
                    <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#FFFBEB' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#D69E2E' }}>{allTasks.filter(t => t.status === 'Working').length}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#975A16', textTransform: 'uppercase' }}>En Curso</div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#FFF5F5' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#E2445C' }}>{allTasks.filter(t => t.status === 'Stuck').length}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#C53030', textTransform: 'uppercase' }}>Detenidas</div>
                    </div>
                    <div style={{ padding: '1rem', borderRadius: '8px', backgroundColor: '#EBF8FF' }}>
                        <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#3182CE' }}>{allTasks.filter(t => t.status === 'Future').length}</div>
                        <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#2B6CB0', textTransform: 'uppercase' }}>Planificadas</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
