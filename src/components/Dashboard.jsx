import React, { useState, useRef } from 'react';
import {
    Plus,
    MoreHorizontal,
    Search,
    Filter,
    User,
    AlertCircle,
    Trash2,
    X,
    MessageSquare,
    Edit
} from 'lucide-react';

/* --- MONDAY.COM STYLE CONSTANTS --- */
const STATUS_COLORS = {
    Done: { bg: '#00C875', color: '#fff' },
    Working: { bg: '#FDAB3D', color: '#fff' },
    Stuck: { bg: '#E2445C', color: '#fff' },
    Future: { bg: '#579BFC', color: '#fff' },
    Info: { bg: '#C4C4C4', color: '#fff' }
};

// 9 MODULES -> 9 GROUPS
export const INITIAL_GROUPS = [
    {
        id: 'economic',
        title: '1. Gestión Económica',
        color: '#ECC94B', // Gold
        items: [
            { id: 101, name: 'Ejecución Fondos (12.000€)', owner: 'PM', status: 'Working', metric: 'Deadline 12 Mar', timeline: 50 },
            { id: 102, name: 'Justificación Facturas Lilly', owner: 'ADM', status: 'Future', metric: 'Pendiente', timeline: 0 },
            { id: 103, name: 'Pago Inscripciones eaHP', owner: 'PM', status: 'Done', metric: 'Completado', timeline: 100 }
        ]
    },
    {
        id: 'urgencias',
        title: '2. Urgencias (Comité Clínico)',
        color: '#F56565', // Red
        items: [
            { id: 201, name: 'Reunión Bimensual Febrero', owner: 'MED', status: 'Working', metric: '15 Feb', timeline: 50 },
            { id: 202, name: 'Revisión Acta Anterior', owner: 'SEC', status: 'Done', metric: 'Enviada', timeline: 100 },
            { id: 203, name: 'Definición Nuevos Protocolos', owner: 'MED', status: 'Working', metric: '3 en curso', timeline: 50 }
        ]
    },
    {
        id: 'patient',
        title: '3. Atención al Paciente',
        color: '#48BB78', // Green
        items: [
            { id: 301, name: 'Registro Incidencias PSM', owner: 'NUR', status: 'Working', metric: 'Diario', timeline: 50 },
            { id: 302, name: 'Entrevistas Feedback (N=30)', owner: 'RES', status: 'Done', metric: 'Finalizado', timeline: 100 },
            { id: 303, name: 'Análisis Dudas al Alta', owner: 'PM', status: 'Future', metric: 'Marzo', timeline: 0 }
        ]
    },
    {
        id: 'it',
        title: '4. Sistemas de Información (Asserta)',
        color: '#DD6B20', // Orange
        items: [
            { id: 401, name: 'Implementación Fase 3', owner: 'IT', status: 'Stuck', metric: 'Retraso', timeline: 50, alert: true },
            { id: 402, name: 'Validación DEMO Centro Ref.', owner: 'IT', status: 'Working', metric: 'En pruebas', timeline: 50 },
            { id: 403, name: 'Plan Aceleración (Recursos)', owner: 'DIR', status: 'Working', metric: 'Activado', timeline: 50 }
        ]
    },
    {
        id: 'users',
        title: '5. Usuarios / Comunidad',
        color: '#ED64A6', // Pink
        items: [
            { id: 501, name: 'Encuesta Satisfacción Q1', owner: 'PM', status: 'Working', metric: '4.8/5 Avg', timeline: 50 },
            { id: 502, name: 'Onboarding Nuevos Usuarios', owner: 'ADM', status: 'Done', metric: '+12 usuarios', timeline: 100 }
        ]
    },
    {
        id: 'catsalut',
        title: '6. CatSalut / Escalabilidad',
        color: '#805AD5', // Purple
        items: [
            { id: 601, name: 'Reporte Sant Pau', owner: 'DIR', status: 'Done', metric: '851 pac.', timeline: 100 },
            { id: 602, name: 'Reporte CST', owner: 'DIR', status: 'Done', metric: '361 pac.', timeline: 100 },
            { id: 603, name: 'Reporte H. Dos de Maig', owner: 'PM', status: 'Working', metric: '45 pac.', timeline: 50 },
            { id: 604, name: 'Reporte Granollers', owner: 'PM', status: 'Stuck', metric: '41 pac.', timeline: 50 }
        ]
    },
    {
        id: 'pubs',
        title: '7. Publicaciones',
        color: '#38B2AC', // Teal
        items: [
            { id: 701, name: 'Estudio Delphi', owner: 'RES', status: 'Done', metric: 'Borrador OK', timeline: 100 },
            { id: 702, name: 'Envío Revista Emergencias', owner: 'PM', status: 'Future', metric: 'Pendiente', timeline: 0 },
            { id: 703, name: 'Póster Congreso SEFH', owner: 'RES', status: 'Future', metric: 'Oct 2026', timeline: 0 }
        ]
    },
    {
        id: 'docencia',
        title: '8. Docencia',
        color: '#D69E2E', // Mustard
        items: [
            { id: 801, name: 'Planificación Sesiones Online', owner: 'PM', status: 'Future', metric: '2, 4 Jun', timeline: 0 },
            { id: 802, name: 'Reserva Sala Actos (Presencial)', owner: 'SEC', status: 'Done', metric: '18 Jun', timeline: 100 },
            { id: 803, name: 'Confirmación Ponentes', owner: 'DIR', status: 'Working', metric: '80% Conf.', timeline: 50 }
        ]
    },
    {
        id: 'memorias',
        title: '9. Memorias y Presentaciones',
        color: '#667EEA', // Indigo
        items: [
            { id: 901, name: 'Cierre Memoria 2025', owner: 'PM', status: 'Done', metric: 'Entregado', timeline: 100 },
            { id: 902, name: 'Presentación Dirección Q1', owner: 'DIR', status: 'Working', metric: 'Marzo', timeline: 50 }
        ]
    }
];

const Avatar = ({ initial, color = '#A0AEC0' }) => (
    <div style={{
        width: '30px',
        height: '30px',
        borderRadius: '50%',
        backgroundColor: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        fontWeight: '600',
        border: '2px solid white'
    }}>
        {initial}
    </div>
);

const StatusPill = ({ status, onClick }) => {
    const style = STATUS_COLORS[status] || STATUS_COLORS.Info;
    const labelMap = {
        Done: 'Listo',
        Working: 'En curso',
        Stuck: 'Detenido',
        Future: 'Planificado'
    };

    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: style.bg,
                color: style.color,
                textAlign: 'center',
                padding: '0.4rem',
                width: '100%',
                fontWeight: '600',
                fontSize: '0.8rem',
                borderRadius: '4px',
                cursor: 'pointer',
                userSelect: 'none'
            }}>
            {labelMap[status]}
        </div>
    );
};

const TimelineBar = ({ percent, color }) => (
    <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: color, borderRadius: '4px', transition: 'width 0.5s ease-in-out, background-color 0.5s ease' }}></div>
    </div>
);

// --- MODAL COMPONENT (Task Detail) ---
const TaskDetailModal = ({ isOpen, onClose, onSave, groups, taskToEdit }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        lineaTrabajo: groups[0].id,
        actividad: '',
        tarea: '',
        responsable: '',
        estado: 'Future',
        datoClave: ''
    });

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            if (taskToEdit) {
                // Find group for taskToEdit
                const group = groups.find(g => g.items.some(i => i.id === taskToEdit.id));
                setFormData({
                    lineaTrabajo: group ? group.id : groups[0].id,
                    actividad: taskToEdit.activity || '',
                    tarea: taskToEdit.name,
                    responsable: taskToEdit.owner,
                    estado: taskToEdit.status,
                    datoClave: taskToEdit.metric === '-' ? '' : taskToEdit.metric
                });
                setComments(taskToEdit.comments || []);
            } else {
                setFormData({
                    lineaTrabajo: groups[0].id,
                    actividad: '',
                    tarea: '',
                    responsable: '',
                    estado: 'Future',
                    datoClave: ''
                });
                setComments([]);
            }
            setNewComment('');
        }
    }, [taskToEdit, isOpen, groups]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            text: newComment,
            date: new Date().toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
        };
        setComments(prev => [...prev, comment]);
        setNewComment('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData, comments);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '600px',
                maxWidth: '95%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2D3748' }}>
                        {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718096' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Línea de Trabajo */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Línea de trabajo</label>
                        <select
                            name="lineaTrabajo"
                            value={formData.lineaTrabajo}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                        >
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.title}</option>
                            ))}
                        </select>
                    </div>

                    {/* Actividad y Dato Clave Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Actividad (Contexto)</label>
                            <input
                                type="text"
                                name="actividad"
                                value={formData.actividad}
                                onChange={handleChange}
                                placeholder="Ej. Revisión anual"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Dato Clave</label>
                            <input
                                type="text"
                                name="datoClave"
                                value={formData.datoClave}
                                onChange={handleChange}
                                placeholder="Ej. 15 Feb"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>

                    {/* Tarea */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Nombre de la Tarea</label>
                        <input
                            type="text"
                            name="tarea"
                            value={formData.tarea}
                            onChange={handleChange}
                            placeholder="Descripción de la tarea"
                            required
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                        />
                    </div>

                    {/* Responsable & Estado */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Responsable (Iniciales)</label>
                            <input
                                type="text"
                                name="responsable"
                                value={formData.responsable}
                                onChange={handleChange}
                                placeholder="Ej. PM"
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4A5568', marginBottom: '0.5rem' }}>Estado</label>
                            <select
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            >
                                <option value="Future">Planificado</option>
                                <option value="Working">En curso</option>
                                <option value="Done">Listo</option>
                                <option value="Stuck">Detenido</option>
                            </select>
                        </div>
                    </div>

                    {/* COMMENTS SECTION */}
                    <div style={{ marginTop: '1rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#2D3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={16} /> Comentarios
                        </h3>

                        <div style={{
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginBottom: '1rem',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            backgroundColor: '#F7FAFC',
                            padding: '1rem',
                            borderRadius: '6px'
                        }}>
                            {comments.length === 0 && <p style={{ color: '#A0AEC0', fontSize: '0.875rem', fontStyle: 'italic' }}>No hay comentarios aún.</p>}
                            {comments.map(c => (
                                <div key={c.id} style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '4px', border: '1px solid #E2E8F0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.25rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontWeight: '600' }}>Usuario</span>
                                        <span>{c.date}</span>
                                    </div>
                                    <div style={{ color: '#2D3748', fontSize: '0.9rem', lineHeight: '1.4' }}>{c.text}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                placeholder="Escribe un comentario u observación..."
                                style={{ flex: 1, padding: '0.75rem', borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '0.9rem' }}
                            />
                            <button
                                type="button"
                                onClick={handleAddComment}
                                style={{
                                    padding: '0 1rem',
                                    borderRadius: '4px',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}>
                                Enviar
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                        <button type="button" onClick={onClose} style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #E2E8F0', background: 'white', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', background: 'var(--color-primary)', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                            {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default function Dashboard({ storageKey = 'dashboardGroups', title = 'Planificación de Proyectos', initialData = INITIAL_GROUPS }) {
    const [activeGroups, setActiveGroups] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? JSON.parse(saved) : initialData;
    });

    // Save to localStorage whenever activeGroups changes
    React.useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(activeGroups));
    }, [activeGroups, storageKey]);
    const [newTasks, setNewTasks] = useState({});
    const firstInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null); // STATE FOR EDITING

    // --- EDITING LOGIC ---
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const startEditing = (item) => {
        setEditingId(item.id);
        setEditValue(item.name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const saveEdit = (groupId, itemId) => {
        if (!editValue.trim()) return;

        setActiveGroups(prev => prev.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    items: group.items.map(item => {
                        if (item.id === itemId) {
                            return { ...item, name: editValue };
                        }
                        return item;
                    })
                };
            }
            return group;
        }));
        setEditingId(null);
    };
    // ---------------------

    // Helper to get percent from status
    const getPercentFromStatus = (status) => {
        switch (status) {
            case 'Done': return 100;
            case 'Working': return 50;
            case 'Stuck': return 50;
            case 'Future': return 0;
            default: return 0;
        }
    };

    const openNewTaskModal = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const openEditTaskModal = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleModalSave = (formData, comments) => {
        const newItem = {
            id: taskToEdit ? taskToEdit.id : Date.now(),
            name: formData.tarea,
            owner: formData.responsable || '?',
            status: formData.estado,
            metric: formData.datoClave || '-',
            timeline: getPercentFromStatus(formData.estado),
            activity: formData.actividad,
            comments: comments
        };

        setActiveGroups(prev => {
            // Check if group changed
            const oldGroup = prev.find(g => g.items.some(i => i.id === taskToEdit?.id));
            const isSameGroup = oldGroup && oldGroup.id === formData.lineaTrabajo;

            if (taskToEdit && isSameGroup) {
                // Same group: update in place
                return prev.map(group => {
                    if (group.id === formData.lineaTrabajo) {
                        return {
                            ...group,
                            items: group.items.map(i => i.id === taskToEdit.id ? newItem : i)
                        };
                    }
                    return group;
                });
            }

            // New or Moved: Remove from old (if exists) and add to new
            let groupsToProcess = prev;
            if (taskToEdit) {
                groupsToProcess = groupsToProcess.map(g => ({
                    ...g,
                    items: g.items.filter(i => i.id !== taskToEdit.id)
                }));
            }

            return groupsToProcess.map(group => {
                if (group.id === formData.lineaTrabajo) {
                    return { ...group, items: [...group.items, newItem] };
                }
                return group;
            });
        });

        setTaskToEdit(null);
    };

    const handleInputChange = (groupId, value) => {
        setNewTasks(prev => ({ ...prev, [groupId]: value }));
    };

    const handleQuickAdd = (e, groupId) => {
        e.preventDefault();
        const taskName = newTasks[groupId];
        if (!taskName || !taskName.trim()) return;

        const newItem = {
            id: Date.now(),
            name: taskName,
            owner: 'ME',
            status: 'Working',
            metric: '-',
            timeline: 50
        };

        setActiveGroups(prev => prev.map(group => {
            if (group.id === groupId) {
                return { ...group, items: [...group.items, newItem] };
            }
            return group;
        }));

        setNewTasks(prev => ({ ...prev, [groupId]: '' }));
    };

    const toggleStatus = (groupId, itemId) => {
        const nextStatus = {
            'Working': 'Done',
            'Done': 'Stuck',
            'Stuck': 'Future',
            'Future': 'Working'
        };

        setActiveGroups(prev => prev.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    items: group.items.map(item => {
                        if (item.id === itemId) {
                            const newStatus = nextStatus[item.status] || 'Working';
                            return {
                                ...item,
                                status: newStatus,
                                timeline: getPercentFromStatus(newStatus)
                            };
                        }
                        return item;
                    })
                };
            }
            return group;
        }));
    };

    const deleteItem = (groupId, itemId) => {
        setActiveGroups(prev => prev.map(group => {
            if (group.id === groupId) {
                return { ...group, items: group.items.filter(i => i.id !== itemId) };
            }
            return group;
        }));
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto', fontFamily: 'var(--font-family)' }}>
            {/* Header Monday Style */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700' }}>{title}</h1>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button style={{ borderBottom: '2px solid var(--color-primary)', paddingBottom: '0.5rem', fontWeight: '600', border: 'none', background: 'none', color: '#2D3748', cursor: 'pointer' }}>Tabla principal</button>
                        <button style={{ color: '#718096', paddingBottom: '0.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>Kanban</button>
                        <button style={{ color: '#718096', paddingBottom: '0.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>Gantt</button>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: '#718096', fontSize: '0.875rem' }}>Última act: Hace unos segundos</span>
                    <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                        <button
                            onClick={() => {
                                if (window.confirm('¿Estás seguro de que quieres restaurar los valores por defecto? Se perderán los cambios actuales.')) {
                                    setActiveGroups(initialData);
                                    localStorage.setItem(storageKey, JSON.stringify(initialData));
                                }
                            }}
                            style={{
                                marginRight: '1rem',
                                padding: '0.25rem 0.75rem',
                                fontSize: '0.75rem',
                                color: '#E53E3E',
                                border: '1px solid #E53E3E',
                                borderRadius: '4px',
                                background: 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            Restaurar
                        </button>
                        <div style={{ marginLeft: '-8px' }}><Avatar initial="J" color="#6B46C1" /></div>
                        <div style={{ marginLeft: '-8px' }}><Avatar initial="M" color="#3182CE" /></div>
                        <div style={{ marginLeft: '-8px' }}><Avatar initial="S" color="#D53F8C" /></div>
                        <button
                            onClick={openNewTaskModal}
                            style={{ marginLeft: '8px', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #CBD5E0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#718096', background: 'white', cursor: 'pointer' }}
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Helper Bar */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
                <button
                    onClick={openNewTaskModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(107, 70, 193, 0.3)' }}
                >
                    <Plus size={16} /> Nuevo Elemento
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.875rem', color: '#4A5568', cursor: 'pointer' }}>
                    <Search size={16} /> Buscar
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.875rem', color: '#4A5568', cursor: 'pointer' }}>
                    <User size={16} /> Personas
                </button>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px', fontSize: '0.875rem', color: '#4A5568', cursor: 'pointer' }}>
                    <Filter size={16} /> Filtrar
                </button>
            </div>

            {/* GROUPS RENDER */}
            {activeGroups.map((group, index) => (
                <div key={group.id} style={{ marginBottom: '3rem' }}>
                    {/* Group Header */}
                    <h2 style={{ fontSize: '1.25rem', color: group.color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                        <MoreHorizontal size={20} color="#CBD5E0" style={{ cursor: 'pointer' }} />
                        {group.title}
                        <span style={{ fontSize: '0.875rem', color: '#A0AEC0', fontWeight: 'normal', backgroundColor: 'white', padding: '0.1rem 0.5rem', borderRadius: '99px', border: '1px solid #E2E8F0' }}>{group.items.length} tareas</span>
                    </h2>

                    {/* TABLE CONTAINER */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '6px 4fr 1fr 1.5fr 2fr 2fr 40px',
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden',
                        border: '1px solid #E2E8F0'
                    }}>

                        {/* Table Head */}
                        <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '6px 4fr 1fr 1.5fr 2fr 2fr 40px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#F9FAFB' }}>
                            <div style={{ width: '6px' }}></div>
                            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#718096', fontWeight: '500' }}>Tarea / Elemento</div>
                            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#718096', fontWeight: '500', textAlign: 'center' }}>Resp.</div>
                            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#718096', fontWeight: '500', textAlign: 'center' }}>Estado</div>
                            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#718096', fontWeight: '500', textAlign: 'center' }}>Dato Clave</div>
                            <div style={{ padding: '0.75rem', fontSize: '0.8rem', color: '#718096', fontWeight: '500', textAlign: 'center' }}>Cronograma</div>
                            <div style={{ width: '40px' }}></div>
                        </div>

                        {/* Rows */}
                        {group.items.map(item => (
                            <div key={item.id} className="monday-row" style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '6px 4fr 1fr 1.5fr 2fr 2fr 40px', borderBottom: '1px solid #F7FAFC', alignItems: 'center', transition: 'background-color 0.1s' }}>

                                {/* Colored Side Bar */}
                                <div style={{ height: '100%', backgroundColor: group.color }}></div>

                                {/* Name */}
                                <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {item.alert && <AlertCircle size={16} color="#E2445C" />}

                                        {editingId === item.id ? (
                                            <input
                                                autoFocus
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onBlur={() => saveEdit(group.id, item.id)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') saveEdit(group.id, item.id);
                                                    if (e.key === 'Escape') cancelEdit();
                                                }}
                                                style={{
                                                    fontSize: '0.9rem',
                                                    padding: '2px 4px',
                                                    border: '1px solid #3182CE',
                                                    borderRadius: '4px',
                                                    width: '100%',
                                                    outline: 'none'
                                                }}
                                            />
                                        ) : (
                                            <span
                                                onClick={() => startEditing(item)}
                                                title="Click para editar"
                                                style={{ color: '#2D3748', fontWeight: '400', fontSize: '0.9rem', cursor: 'text', borderBottom: '1px dashed transparent', paddingBottom: '1px' }}
                                                onMouseEnter={(e) => e.target.style.borderBottom = '1px dashed #CBD5E0'}
                                                onMouseLeave={(e) => e.target.style.borderBottom = '1px dashed transparent'}
                                            >
                                                {item.name}
                                            </span>
                                        )}
                                    </div>
                                    {item.activity && <span style={{ fontSize: '0.75rem', color: '#A0AEC0', paddingLeft: item.alert ? '1.5rem' : '0' }}>{item.activity}</span>}
                                </div>

                                {/* Owner */}
                                <div style={{ padding: '0.5rem', display: 'flex', justifyContent: 'center' }}>
                                    <Avatar initial={item.owner.substring(0, 2).toUpperCase()} color={group.color} />
                                </div>

                                {/* Status */}
                                <div style={{ padding: '0.25rem 0.5rem' }}>
                                    <StatusPill status={item.status} onClick={() => toggleStatus(group.id, item.id)} />
                                </div>

                                {/* Metric */}
                                <div style={{ padding: '0.75rem', textAlign: 'center', fontSize: '0.85rem', color: '#4A5568' }}>
                                    {item.metric}
                                </div>

                                {/* Timeline */}
                                <div style={{ padding: '0.75rem 1.5rem' }}>
                                    <TimelineBar percent={item.timeline} color={STATUS_COLORS[item.status] ? STATUS_COLORS[item.status].bg : group.color} />
                                </div>

                                {/* Action (Delete & Edit Hint) */}
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                                    <Trash2
                                        size={16}
                                        color="#CBD5E0"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => deleteItem(group.id, item.id)}
                                        onMouseEnter={(e) => e.target.style.color = '#F56565'}
                                        title="Eliminar tarea"
                                    />
                                    <Edit
                                        size={16}
                                        color="#CBD5E0"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => openEditTaskModal(item)}
                                        onMouseEnter={(e) => e.target.style.color = 'var(--color-primary)'}
                                        onMouseLeave={(e) => e.target.style.color = '#CBD5E0'}
                                        title="Editar detalles y comentarios"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Add Row (Functional) */}
                        <form
                            onSubmit={(e) => handleQuickAdd(e, group.id)}
                            style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '6px 1fr', alignItems: 'center', borderTop: '1px solid #E2E8F0' }}
                        >
                            <div style={{ height: '36px', backgroundColor: group.color, opacity: 0.3, borderRadius: '0 0 0 6px' }}></div>
                            <div style={{ padding: '0.25rem 1rem' }}>
                                <input
                                    ref={index === 0 ? firstInputRef : null}
                                    type="text"
                                    value={newTasks[group.id] || ''}
                                    onChange={(e) => handleInputChange(group.id, e.target.value)}
                                    placeholder="+ Agregar elemento (Añadir rápido)"
                                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', width: '100%', color: '#718096' }}
                                />
                            </div>
                        </form>

                    </div>
                </div>
            ))}

            {/* Spacer */}
            <div style={{ height: '4rem' }}></div>

            {/* MODAL INSTANCE */}
            <TaskDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleModalSave}
                groups={activeGroups}
                taskToEdit={taskToEdit}
            />

        </div>
    );
}
