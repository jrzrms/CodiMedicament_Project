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
    Edit,
    RotateCcw,
    Download,
    Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

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
        color: '#ECC94B',
        items: [
            { id: 101, name: 'Ejecución Fondos Publicación (12.000€)', owner: 'PM', status: 'Working', metric: 'Deadline 12 Mar', timeline: 50, activity: '', comments: [] },
            { id: 1771265400868, name: 'Excel Gastos Curso CM', owner: '?', status: 'Future', metric: '-', timeline: 0, activity: 'Curso Presencial CM', comments: [] },
            { id: 1771876974185, name: 'Financiación Laboratorios', owner: 'JR', status: 'Working', metric: '28/02/26', timeline: 50, activity: 'Curso Presencial CM', comments: [{ id: 1771876957802, text: 'Lilly: Programa + Excel gastos + Carta', date: '23 feb, 21:02' }, { id: 1771876971507, text: 'Organon: Programa modificado', date: '23 feb, 21:02' }] }
        ]
    },
    {
        id: 'urgencias',
        title: '2. Urgencias (Comité Clínico)',
        color: '#F56565',
        items: [
            { id: 201, name: 'Reunión Trimestral', owner: 'CP', status: 'Working', metric: '20 Marzo', timeline: 50, activity: '', comments: [] },
            { id: 203, name: 'Definición Nuevos Protocolos', owner: 'MED', status: 'Working', metric: '3 en curso', timeline: 50 },
            { id: 1771270686443, name: 'Identificar problemas de adherencia', owner: 'JR', status: 'Working', metric: '-', timeline: 50, activity: 'Adherencia', comments: [] },
            { id: 1771271936801, name: 'RAM Trimestrales', owner: 'JR', status: 'Future', metric: '01/04/24', timeline: 0, activity: 'RAM Farmacovigilancia', comments: [{ id: 1771271935942, text: 'Envío listado trimestral', date: '16 feb, 20:58' }] }
        ]
    },
    {
        id: 'patient',
        title: '3. Atención al Paciente',
        color: '#48BB78',
        items: [
            { id: 302, name: 'Entrevistas Telefónicas (N=30/mes)', owner: 'JR', status: 'Working', metric: 'Finalizado', timeline: 50, activity: '', comments: [] },
            { id: 1771270389586, name: 'Checklist CM', owner: 'Jesus Ruiz', status: 'Working', metric: '2802/26', timeline: 50, activity: '', comments: [] },
            { id: 1771270494360, name: 'Entrevistas Preseniales (N=20/mes)', owner: 'JR', status: 'Future', metric: '-', timeline: 0, activity: '', comments: [] },
            { id: 1771270533398, name: 'Test adherencia', owner: 'JR/MP/AD', status: 'Future', metric: '30/03/26', timeline: 0, activity: 'Adherencia', comments: [] }
        ]
    },
    {
        id: 'it',
        title: '4. Sistemas de Información (Asserta)',
        color: '#DD6B20',
        items: [
            { id: 1771269676908, name: 'CAP Serdenya: Incluir casos', owner: 'Jesus Ruiz', status: 'Working', metric: '-', timeline: 50, activity: 'Coordinación', comments: [] },
            { id: 1771270722916, name: 'CAP Larrand: Incluir casos', owner: 'JR', status: 'Working', metric: '30/03/26', timeline: 50, activity: 'Coordinación', comments: [] },
            { id: 1771271474124, name: 'Demo CM Colaboradores', owner: 'AST', status: 'Stuck', metric: '-', timeline: 50, activity: 'Plataforma CM', comments: [{ id: 1771271445969, text: 'A la espera de que Asserta entregue enlaces', date: '16 feb, 20:50' }, { id: 1771271461137, text: 'Partners: Envío de comentarios', date: '16 feb, 20:51' }] },
            { id: 1771271569459, name: 'CAP ICS', owner: '?', status: 'Working', metric: '-', timeline: 50, activity: 'Casos Atención primaria', comments: [{ id: 1771271554853, text: 'Discutir casos con Noemí y Marta', date: '16 feb, 20:52' }] }
        ]
    },
    {
        id: 'users',
        title: '5. Usuarios / Comunidad',
        color: '#ED64A6',
        items: [
            { id: 501, name: 'Encuesta Satisfacción', owner: 'PM', status: 'Working', metric: '4.8/5 Avg', timeline: 50, activity: '', comments: [] },
            { id: 502, name: 'Onboarding Nuevos Usuarios', owner: 'ADM', status: 'Done', metric: '+12 usuarios', timeline: 100 },
            { id: 1771264049116, name: 'Envío SMS', owner: 'Jesus Ruiz', status: 'Working', metric: '-', timeline: 50, activity: 'SMS pacientes', comments: [] },
            { id: 1771271737007, name: 'Genero Ainhoa', owner: '?', status: 'Future', metric: '-', timeline: 0, activity: 'Usuarios y comunidad', comments: [{ id: 1771271732610, text: 'Pendiente visto bueno Ainhoa', date: '16 feb, 20:55' }] }
        ]
    },
    {
        id: 'catsalut',
        title: '6. CatSalut / Escalabilidad',
        color: '#805AD5',
        items: [
            { id: 601, name: 'Reporte Sant Pau', owner: 'DIR', status: 'Done', metric: '851 pac.', timeline: 100 },
            { id: 602, name: 'Reporte CST', owner: 'DIR', status: 'Done', metric: '361 pac.', timeline: 100 },
            { id: 603, name: 'Reporte H. Dos de Maig', owner: 'PM', status: 'Done', metric: '45 pac.', timeline: 100 },
            { id: 604, name: 'Reporte Granollers', owner: 'PM', status: 'Stuck', metric: '41 pac.', timeline: 50 },
            { id: 1771271325571, name: 'Reunión Catsalut', owner: 'AF/CS/JR', status: 'Stuck', metric: '-', timeline: 50, activity: 'Reunión Catsalut', comments: [] },
            { id: 1771271808236, name: 'Certificación CM: Documento', owner: 'JR/CS', status: 'Future', metric: '-', timeline: 0, activity: 'Certificación', comments: [] }
        ]
    },
    {
        id: 'pubs',
        title: '7. Publicaciones',
        color: '#38B2AC',
        items: [
            { id: 703, name: 'Póster Congreso SEFH', owner: 'RES', status: 'Future', metric: 'Oct 2026', timeline: 0 },
            { id: 1771266466707, name: 'Publicación CST', owner: 'Jordi Fernández', status: 'Working', metric: '30/03/26', timeline: 50, activity: 'Publicaciones proyecto', comments: [] },
            { id: 1771266502747, name: 'Publicación Resultados Globales', owner: 'Adrián Plaza', status: 'Working', metric: '30/03/26', timeline: 50, activity: 'Publicaciones proyecto', comments: [] },
            { id: 1771267700164, name: 'CEIC Proyecto', owner: 'Jesus Ruiz', status: 'Working', metric: '-', timeline: 50, activity: 'Publicaciones proyecto', comments: [{ id: 1771267672320, text: 'CEIC Sant Pau', date: '16 feb, 19:47' }, { id: 1771267679448, text: 'CEIC H2M', date: '16 feb, 19:47' }, { id: 1771267686950, text: 'CEIC Granollers', date: '16 feb, 19:48' }, { id: 1771267694161, text: 'CEIC CST', date: '16 feb, 19:48' }] }
        ]
    },
    {
        id: 'docencia',
        title: '8. Docencia (III Curs Bàsic)',
        color: '#D69E2E',
        items: [
            { id: 801, name: 'Planificación Curso Online', owner: 'PM', status: 'Future', metric: '2, 4 Jun', timeline: 0, activity: '', comments: [{ id: 1771271628786, text: 'Programa listo para 3ª edición 2026...', date: '16 feb, 20:53' }] },
            { id: 802, name: 'Reserva Sala Actos (Presencial)', owner: 'SEC', status: 'Done', metric: '18 Jun', timeline: 100 },
            { id: 803, name: 'Confirmación Ponentes', owner: 'DIR', status: 'Working', metric: '80% Conf.', timeline: 50 }
        ]
    },
    {
        id: 'memorias',
        title: '9. Memorias y Presentaciones',
        color: '#667EEA',
        items: [
            { id: 901, name: 'Cierre Memoria 2025', owner: 'PM', status: 'Done', metric: 'Entregado', timeline: 100 },
            { id: 902, name: 'Presentación Dirección Q1', owner: 'DIR', status: 'Working', metric: 'Marzo', timeline: 50 },
            { id: 1771270325326, name: 'Sesion CM Althaia Manresa', owner: 'Jesus Ruiz', status: 'Future', metric: '29/04/26', timeline: 0, activity: 'Otros centros', comments: [] },
            { id: 1771877037155, name: 'Ficha de Seguimiento: Actualizar', owner: 'JR', status: 'Future', metric: '30/03/26', timeline: 0, activity: 'AQUAS', comments: [] }
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

    // --- UNDO HISTORY ---
    const [history, setHistory] = useState([]);

    const updateGroupsWithHistory = (newData) => {
        setHistory(prev => [...prev.slice(-19), JSON.stringify(activeGroups)]); // Keep last 20 changes
        if (typeof newData === 'function') {
            setActiveGroups(prev => {
                const next = newData(prev);
                return next;
            });
        } else {
            setActiveGroups(newData);
        }
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setHistory(prev => prev.slice(0, -1));
        // Use a flag or separate setter to avoid adding this undo itself to history if we were using a middleware, 
        // but here updateGroupsWithHistory is only called for manual changes.
        setActiveGroups(JSON.parse(lastState));
    };

    // --- SEARCH / FILTER STATES ---
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPerson, setFilterPerson] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // --- EXPORT EXCEL ---
    const handleExport = () => {
        const flatData = [];
        activeGroups.forEach(group => {
            group.items.forEach(item => {
                flatData.push({
                    'Línea de Trabajo': group.title,
                    'Tarea': item.name,
                    'Responsable': item.owner,
                    'Estado': item.status,
                    'Dato Clave': item.metric,
                    'Actividad': item.activity || '',
                    'Comentarios': (item.comments || []).map(c => c.text).join(' | ')
                });
            });
        });

        const ws = XLSX.utils.json_to_sheet(flatData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Planificación");
        XLSX.writeFile(wb, `Planificacion_CM_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

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

        updateGroupsWithHistory(prev => prev.map(group => {
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

        updateGroupsWithHistory(prev => {
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

        updateGroupsWithHistory(prev => prev.map(group => {
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

        updateGroupsWithHistory(prev => prev.map(group => {
            if (group.id === groupId) {
                return {
                    ...group,
                    items: group.items.map(item => {
                        if (item.id === itemId) {
                            const newStatus = nextStatus[item.status] || 'Working';

                            // REGISTRAR HITOS SI PASA A 'DONE'
                            if (newStatus === 'Done') {
                                registerMilestone(item, group.title);
                            }

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

    const registerMilestone = (item, groupTitle) => {
        const saved = localStorage.getItem('projectEvolution');
        const evolution = saved ? JSON.parse(saved) : [];

        // Evitar duplicados rápidos si se pulsa varias veces
        const alreadyExists = evolution.some(m => m.taskId === item.id && (new Date() - new Date(m.date)) < 5000);
        if (alreadyExists) return;

        const newMilestone = {
            id: Date.now(),
            taskId: item.id,
            taskName: item.name,
            groupTitle: groupTitle,
            date: new Date().toISOString(),
            owner: item.owner,
            metric: item.metric
        };

        localStorage.setItem('projectEvolution', JSON.stringify([...evolution, newMilestone]));
    };

    const deleteItem = (groupId, itemId) => {
        if (!window.confirm('¿Eliminar esta tarea?')) return;
        updateGroupsWithHistory(prev => prev.map(group => {
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
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleUndo}
                            disabled={history.length === 0}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: history.length === 0 ? '#F7FAFC' : 'white',
                                color: history.length === 0 ? '#CBD5E0' : '#4A5568',
                                cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                transition: 'all 0.2s'
                            }}
                        >
                            <RotateCcw size={16} /> Deshacer
                        </button>
                        <button
                            onClick={handleExport}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                border: '1px solid #E2E8F0',
                                backgroundColor: 'white',
                                color: '#4A5568',
                                cursor: 'pointer',
                                fontSize: '0.875rem',
                                fontWeight: '600'
                            }}
                        >
                            <Download size={16} /> Exportar Excel
                        </button>
                    </div>

                    <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
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
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <button
                    onClick={openNewTaskModal}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--color-primary)', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(107, 70, 193, 0.3)' }}
                >
                    <Plus size={16} /> Nuevo Elemento
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                    <Search size={16} color="#718096" />
                    <input
                        type="text"
                        placeholder="Buscar tarea..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '0.875rem', color: '#4A5568', width: '150px' }}
                    />
                    {searchTerm && <X size={14} color="#CBD5E0" style={{ cursor: 'pointer' }} onClick={() => setSearchTerm('')} />}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                    <Users size={16} color="#718096" />
                    <select
                        value={filterPerson}
                        onChange={(e) => setFilterPerson(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '0.875rem', color: '#4A5568', background: 'transparent', cursor: 'pointer' }}
                    >
                        <option value="">Todos los Responsables</option>
                        {[...new Set(activeGroups.flatMap(g => g.items.map(i => i.owner)))].map(o => (
                            <option key={o} value={o}>{o}</option>
                        ))}
                    </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
                    <Filter size={16} color="#718096" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ border: 'none', outline: 'none', fontSize: '0.875rem', color: '#4A5568', background: 'transparent', cursor: 'pointer' }}
                    >
                        <option value="">Todos los Estados</option>
                        <option value="Done">Listo</option>
                        <option value="Working">En curso</option>
                        <option value="Stuck">Detenido</option>
                        <option value="Future">Planificado</option>
                    </select>
                </div>

                {(searchTerm || filterPerson || filterStatus) && (
                    <button
                        onClick={() => { setSearchTerm(''); setFilterPerson(''); setFilterStatus(''); }}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#E53E3E', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            {/* GROUPS RENDER */}
            {activeGroups.map((group, index) => {
                const filteredItems = group.items.filter(item => {
                    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesPerson = filterPerson === '' || item.owner === filterPerson;
                    const matchesStatus = filterStatus === '' || item.status === filterStatus;
                    return matchesSearch && matchesPerson && matchesStatus;
                });

                if (filteredItems.length === 0 && (searchTerm || filterPerson || filterStatus)) return null;

                return (
                    <div key={group.id} style={{ marginBottom: '3rem' }}>
                        {/* Group Header */}
                        <h2 style={{ fontSize: '1.25rem', color: group.color, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '600' }}>
                            <MoreHorizontal size={20} color="#CBD5E0" style={{ cursor: 'pointer' }} />
                            {group.title}
                            <span style={{ fontSize: '0.875rem', color: '#A0AEC0', fontWeight: 'normal', backgroundColor: 'white', padding: '0.1rem 0.5rem', borderRadius: '99px', border: '1px solid #E2E8F0' }}>{filteredItems.length} tareas</span>
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
                            {filteredItems.map(item => (
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
                );
            })}

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
