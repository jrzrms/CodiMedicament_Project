import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, FileText } from 'lucide-react';

const INITIAL_MESSAGE = "Hola. Soy el Project Management Advisor de Codi Medicament. Estoy aquí para ayudarte con plazos, estados de expansión, logística de docencia y gobernanza. NO resuelvo dudas clínicas.";

const ResourcesSection = () => (
    <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <a
            href="https://notebooklm.google.com/notebook/b0663e84-3d7b-470b-a9af-5a53ae35a486"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                textDecoration: 'none',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid #E2E8F0',
                transition: 'transform 0.2s'
            }}
        >
            <div style={{ padding: '0.75rem', backgroundColor: '#EBF4FF', borderRadius: '50%', color: '#3182CE' }}>
                <FileText size={24} />
            </div>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#2D3748', margin: 0 }}>NotebookLM Codi Medicament</h3>
                <p style={{ fontSize: '0.85rem', color: '#718096', margin: '0.25rem 0 0 0' }}>Consultar documentación oficial</p>
            </div>
        </a>

        <a
            href="https://chatgpt.com/g/g-p-67a8d55a5c748191a90c662388da760b-codigo-medicamento/project"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                textDecoration: 'none',
                backgroundColor: 'white',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid #E2E8F0',
                transition: 'transform 0.2s'
            }}
        >
            <div style={{ padding: '0.75rem', backgroundColor: '#F0FFF4', borderRadius: '50%', color: '#38A169' }}>
                <Bot size={24} />
            </div>
            <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#2D3748', margin: 0 }}>ChatGPT Codi Medicament</h3>
                <p style={{ fontSize: '0.85rem', color: '#718096', margin: '0.25rem 0 0 0' }}>Asistente conversacional experto</p>
            </div>
        </a>
    </div>
);

export default function Chatbot() {
    const [messages, setMessages] = useState([
        { id: 1, text: INITIAL_MESSAGE, sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Simulate AI delay
        setTimeout(() => {
            const responseText = generateResponse(userMsg.text);
            setMessages(prev => [...prev, { id: Date.now() + 1, text: responseText, sender: 'bot' }]);
            setIsTyping(false);
        }, 1000);
    };

    const generateResponse = (text) => {
        const lower = text.toLowerCase();

        // Clinical exclusion rule
        if (lower.match(/(sintoma|dolor|medicamento|dosis|paciente|tratamiento|diagnostico|fiebre|tos)/) && !lower.includes('psm')) {
            return "⚠️ Recordatorio: Como Project Management Advisor, mi función es exclusivamentede gestión. No estoy autorizado para resolver dudas clínicas sobre síntomas o tratamientos.";
        }

        // Rule: Deadlines / Budget
        if (lower.includes('plazo') || lower.includes('dinero') || lower.includes('presupuesto') || lower.includes('12000')) {
            return "🚨 **Alerta de Plazo**: Tenemos una fecha límite crítica el **12 de marzo de 2026** para ejecutar los 12.000€ del presupuesto destinado a publicaciones y congresos (EAHP Barcelona).";
        }

        // Rule: Expansion stats
        if (lower.includes('expansion') || lower.includes('centros') || lower.includes('pacientes') || lower.includes('cst')) {
            return "📊 **Estado de Expansión** (Impacto 2025): \n\n- Sant Pau: 851 pacientes\n- CST: 361 pacientes\n- Hospital Dos de Maig: 45 pacientes\n- Hospital de Granollers: 41 pacientes";
        }

        // Rule: Docencia / Course
        if (lower.includes('curso') || lower.includes('junio') || lower.includes('docencia') || lower.includes('clase')) {
            return "🎓 **III Curs Bàsic**: \n- **Online**: 2 y 4 de junio de 2026.\n- **Presencial**: 18 de junio (Sala de Actos).\n- **Formato**: 12h totales (6h online + 6h presenciales).\n\nRecuerda gestionar la financiación con Organon y Lilly.";
        }

        // Rule: IT / Asserta / Acceleration Plan
        if (lower.includes('it') || lower.includes('asserta') || lower.includes('fase') || lower.includes('retraso') || lower.includes('mitigar')) {
            return "🚀 **Plan de Aceleración (Asserta):**\n- **Mitigación:** Se ha activado un plan que intensifica los recursos de Sant Pau en diseño funcional y solapa fases de validación.\n- **Estado Actual:** Fase 3 (Implementación).";
        }

        // Rule: Contract End
        if (lower.includes('fin') && lower.includes('contrato')) {
            return "📅 **Final del Contrato:**\n- **Fecha Oficial:** 17/03/2027.\n- **Objetivo Plan Aceleración:** Tener la herramienta operativa en el SISCAT antes de finalizar 2026.";
        }

        // Rule: Governance / Meetings / Committee
        if (lower.includes('reunion') || lower.includes('comite') || lower.includes('gobernanza') || lower.includes('miembros')) {
            return "🗓 **Gobernanza del Proyecto**:\n- **Comité Clínico**: Reuniones bimensuales con **18 miembros multidisciplinares**.\n- **Operativas**: Semanal / Quincenal.\n- **Estratégica**: Dirección Sant Pau + CSC + Centros.";
        }

        // Rule: Risks (Project + Clinical)
        if (lower.includes('riesgo') || lower.includes('perfil') || lower.includes('opioide') || lower.includes('calcio')) {
            return "⚠️ **Análisis de Riesgos**:\n\n📉 **Riesgo Principal del Proyecto:** Falta de alineación en los calendarios entre Asserta y los equipos de sistemas de los centros periféricos.\n\n💊 **Perfiles de Riesgo Clínico:**\n- 🔴 **Alto:** N06 (Psicoanalèptics), N02 (Opioides)\n- 🟢 **Bajo:** C08 (Blocadors canals calci)";
        }

        // Rule: Protocols
        if (lower.includes('protocol')) {
            return "📋 **Los 10 Protocolos Principales**:\n1. Hemorragias\n2. Caídas\n3. Crisis Hipertensiva\n4. Ictus\n5. Hiperglucemia\n6. Hipoglucemia\n7. Embolia\n8. Bradicardia\n9. Convulsiones\n10. Estreñimiento";
        }

        // Fallback
        return "No tengo información específica sobre eso. Mis temas son: Plazos y Presupuesto, Datos de Expansión, Curso Docencia, Estado IT (Asserta), Gobernanza y Protocolos.";
    };

    return (
        <div style={{
            maxWidth: '1000px',
            height: 'calc(100vh - 4rem)',
            margin: '2rem auto',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontWeight: '700', color: '#2D3748' }}>Asistente PSM</h1>
                <p style={{ color: '#718096' }}>Soporte inteligente para la gestión del proyecto.</p>
            </header>

            <ResourcesSection />

            <div style={{
                flex: 1,
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <header style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '1rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                        <Bot size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.125rem', color: 'white' }}>Asistente PSM</h2>
                        <p style={{ fontSize: '0.75rem', opacity: 0.9, color: '#E9D8FD' }}>Especializado en Gestión | Codi Medicament</p>
                    </div>
                </header>

                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', backgroundColor: '#F7FAFC' }}>
                    {messages.map((msg) => (
                        <div key={msg.id} style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            marginBottom: '1rem'
                        }}>
                            <div style={{
                                maxWidth: '70%',
                                padding: '1rem',
                                borderRadius: '1rem',
                                backgroundColor: msg.sender === 'user' ? 'var(--color-primary)' : 'white',
                                color: msg.sender === 'user' ? 'white' : '#2D3748',
                                boxShadow: msg.sender === 'bot' ? '0 1px 2px 0 rgba(0,0,0,0.05)' : 'none',
                                borderTopLeftRadius: msg.sender === 'bot' ? '0' : '1rem',
                                borderTopRightRadius: msg.sender === 'user' ? '0' : '1rem',
                                whiteSpace: 'pre-line' // To handle newlines in responses
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{ display: 'flex', padding: '0.5rem 1rem', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.875rem' }}>
                            <RefreshCw className="spin" size={14} /> Escribiendo...
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} style={{
                    padding: '1rem',
                    borderTop: '1px solid #E2E8F0',
                    display: 'flex',
                    gap: '1rem',
                    backgroundColor: 'white'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Pregunta sobre plazos, expansión, curso..."
                        style={{
                            flex: 1,
                            padding: '0.75rem 1rem',
                            borderRadius: '99px',
                            border: '1px solid #CBD5E0',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                    <button type="submit" disabled={!input.trim()} style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '48px',
                        height: '48px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: input.trim() ? 'pointer' : 'default',
                        opacity: input.trim() ? 1 : 0.5
                    }}>
                        <Send size={20} />
                    </button>
                </form>

                {/* Simple spin animation for the typing indicator */}
                <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
            </div>
        </div>
    );
}
