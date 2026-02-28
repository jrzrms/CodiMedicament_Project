import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard, { INITIAL_GROUPS } from './components/Dashboard';
import Kanban from './components/Kanban';
import Chatbot from './components/Chatbot';
import WebPlatform from './components/WebPlatform';
import Ecosystem from './components/Ecosystem';
import ProcesoCM from './components/ProcesoCM';

import ProfessionalsMaterial from './components/ProfessionalsMaterial';
import PatientEducation from './components/PatientEducation';
import ProjectEvolution from './components/ProjectEvolution';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const ideasInitialData = INITIAL_GROUPS.map(g => ({ ...g, items: [] }));

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard />;
            case 'web':
                return <WebPlatform />;
            case 'ecosystem':
                return <Ecosystem />;
            case 'proceso':
                return <ProcesoCM />;
            case 'professionals':
                return <ProfessionalsMaterial />;
            case 'education':
                return <PatientEducation />;
            case 'kanban':
                return <Kanban />;
            case 'ideas':
                return <Dashboard key="ideas" storageKey="ideasGroupsV2" title="Banco de Ideas CM" initialData={ideasInitialData} />;
            case 'evolution':
                return <ProjectEvolution />;
            case 'chatbot':
                return <Chatbot />;
            default:
                return <Dashboard key="dashboard" />;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main style={{
                marginLeft: 'var(--sidebar-width)',
                width: 'calc(100% - var(--sidebar-width))',
                minHeight: '100vh',
                backgroundColor: '#F7FAFC'
            }}>
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
