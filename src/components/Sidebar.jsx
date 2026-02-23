import React from 'react';
import { LayoutDashboard, ListTodo, MessageSquare, Settings, Users, LogOut, Globe, Share2, GitMerge, Building2, GraduationCap, Lightbulb } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
    const menuItems = [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
        { id: 'web', label: 'Plataforma Web', icon: Globe },
        { id: 'ecosystem', label: 'Ecosistema', icon: Share2 },
        { id: 'proceso', label: 'Proceso CM', icon: GitMerge },
        { id: 'centers', label: 'Captación Centros', icon: Building2 },
        { id: 'education', label: 'Educación Pacientes', icon: GraduationCap },
        { id: 'kanban', label: 'Gestión de Tareas', icon: ListTodo },
        { id: 'ideas', label: 'Ideas CM', icon: Lightbulb },
        { id: 'chatbot', label: 'Asistente PSM', icon: MessageSquare },
    ];

    return (
        <aside style={{
            width: 'var(--sidebar-width)',
            height: '100vh',
            backgroundColor: '#fff',
            borderRight: '1px solid var(--color-border)',
            position: 'fixed',
            left: 0,
            top: 0,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 10
        }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid var(--color-border)' }}>
                <h2 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '4px' }}></div>
                    CodiMedicament
                </h2>
                <span style={{ fontSize: '0.75rem', color: '#718096', display: 'block', marginTop: '0.25rem' }}>
                    Hospital de Sant Pau
                </span>
            </div>

            <nav style={{ flex: 1, padding: '1rem' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <li key={item.id} style={{ marginBottom: '0.5rem' }}>
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        border: 'none',
                                        textAlign: 'left',
                                        fontWeight: isActive ? 600 : 400,
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={20} />
                                    {item.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--color-border)' }}>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--color-text-muted)',
                    background: 'none',
                    border: 'none',
                    padding: '0.75rem',
                    width: '100%'
                }}>
                    <Settings size={18} /> Configure
                </button>
                <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    color: 'var(--color-danger)',
                    background: 'none',
                    border: 'none',
                    padding: '0.75rem',
                    width: '100%'
                }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
}
