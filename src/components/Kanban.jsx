import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function Kanban() {
    const [priorityTasks, setPriorityTasks] = useState([]);
    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        // 1. Load data
        const saved = localStorage.getItem('dashboardGroups');
        if (!saved) return;

        const groups = JSON.parse(saved);
        const flattened = [];

        // 2. Flatten and Parse
        groups.forEach(group => {
            group.items.forEach(item => {
                // Only consider active tasks (not Done?) -> User said "Top 5 tasks", assuming pending.
                // But "Done" might be relevant if completed recently. Let's prioritize 'Working'/'Future'/'Stuck'.
                if (item.status === 'Done') return;

                const dateScore = parseDateScore(item.metric);
                flattened.push({
                    ...item,
                    groupTitle: group.title,
                    groupColor: group.color,
                    dateScore: dateScore // Lower is sooner
                });
            });
        });

        // 3. Sort by Date Score (Ascending) -> Then by Timeline?
        // Filter out items with no date (infinity) unless we want them? 
        // Let's keep them but put them at the end.
        flattened.sort((a, b) => a.dateScore - b.dateScore);

        // 4. Take Top 5
        setPriorityTasks(flattened.slice(0, 5));
        setAllTasks(flattened);

    }, []);

    // Helper to parse dates like "15 Feb", "Deadline 12 Mar"
    // Returns a number (timestamp approx) for sorting.
    const parseDateScore = (text) => {
        if (!text || text === '-' || text === 'Pendiente') return 9999999999999;

        const now = new Date();
        const currentYear = now.getFullYear(); // 2026 based on context
        const months = {
            'ene': 0, 'jan': 0,
            'feb': 1,
            'mar': 2,
            'abr': 3, 'apr': 3,
            'may': 4,
            'jun': 5,
            'jul': 6,
            'ago': 7, 'aug': 7,
            'sep': 8,
            'oct': 9,
            'nov': 10,
            'dic': 11, 'dec': 11
        };

        const lower = text.toLowerCase();

        // Look for Month names
        let monthIndex = -1;
        for (const [m, idx] of Object.entries(months)) {
            if (lower.includes(m)) {
                monthIndex = idx;
                break;
            }
        }

        if (monthIndex === -1) return 9999999999999; // No date found

        // Look for digits
        const digits = lower.match(/\d+/);
        const day = digits ? parseInt(digits[0]) : 1; // Default to 1st of month if no day

        // Create date object
        const date = new Date(currentYear, monthIndex, day);

        // If date is in the past (e.g. it's Dec and we see "Jan"), maybe it's next year?
        // For now assume current year 2026/2027 context.

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
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#2D3748', marginBottom: '0.5rem' }}>Tablero de Trabajo Semanal</h1>
                <p style={{ color: '#718096' }}>Foco en las 5 tareas prioritarias por fecha de entrega.</p>
            </header>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {priorityTasks.length > 0 ? priorityTasks.map((task, index) => (
                    <div key={task.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        borderLeft: `6px solid ${task.groupColor}`
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
                                    {task.groupTitle.split('.')[1] || task.groupTitle} {/* Remove number prefix */}
                                </span>
                                {task.alert && <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', color: '#E2445C', fontWeight: '600' }}><AlertCircle size={12} style={{ marginRight: '4px' }} /> Atención</span>}
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2D3748', marginBottom: '0.5rem' }}>{task.name}</h3>
                            <div style={{ display: 'flex', gap: '1.5rem', color: '#718096', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Calendar size={16} />
                                    {task.metric}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: getStatusColor(task.status) }}></div>
                                    {getStatusLabel(task.status)}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Clock size={16} />
                                    Resp: {task.owner}
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
                                transition: 'background-color 0.2s'
                            }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#E2E8F0'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#EDF2F7'}
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#A0AEC0' }}>
                        <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No hay tareas pendientes con fecha prioritaria.</p>
                    </div>
                )}
            </div>

            {/* Fallback info */}
            <div style={{ marginTop: '4rem', padding: '2rem', backgroundColor: '#F7FAFC', borderRadius: '8px' }}>
                <h4 style={{ fontWeight: '600', color: '#4A5568', marginBottom: '1rem' }}>Resumen Rápido</h4>
                <div style={{ display: 'flex', gap: '2rem' }}>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2D3748' }}>{allTasks.filter(t => t.status === 'Working').length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>En Curso</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#E2445C' }}>{allTasks.filter(t => t.status === 'Stuck').length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>Detenidas</div>
                    </div>
                    <div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#579BFC' }}>{allTasks.filter(t => t.status === 'Future').length}</div>
                        <div style={{ fontSize: '0.875rem', color: '#718096' }}>Planificadas</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
