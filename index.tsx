
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat, Part } from '@google/genai';
import MarkdownIt from 'markdown-it';
import './index.css';

const md = new MarkdownIt({ html: true, linkify: true });

// --- ICON COMPONENTS ---
const IconBook = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
const IconPlant = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7z"></path><path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"></path></svg>;
const IconComputer = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>;
const IconGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconSearch = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconGamepad = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19.12 4.94a4 4 0 0 1 0 5.66L12 18.22l-7.12-7.62a4 4 0 1 1 5.66-5.66l1.46 1.47 1.46-1.47a4 4 0 0 1 5.66 0z"></path></svg>;
const IconLibrary = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 12H19c-1.1 0-2 .9-2 2v7h-1c-1.1 0-2-.9-2-2v-5c0-1.1-.9-2-2-2H2.5"></path><path d="M2.5 12H5c1.1 0 2-.9 2-2V3h1c1.1 0 2 .9 2 2v5c0 1.1.9 2 2 2h11.5"></path><path d="M12 3v18"></path><path d="M12 3a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path></svg>;
const IconCompass = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconSun = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;
const IconMoon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
const IconCopy = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconCheck = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMic = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>;
const IconPaperclip = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>;

const iconMap = {
  IconBook: <IconBook />, IconPlant: <IconPlant />, IconComputer: <IconComputer />,
  IconGlobe: <IconGlobe />, IconSearch: <IconSearch />, IconGamepad: <IconGamepad />,
  IconLibrary: <IconLibrary />, IconCompass: <IconCompass />, IconPlus: <IconPlus />
};
type IconName = keyof typeof iconMap;

// --- DEFAULT PERSONAS ---
const defaultPersonas = {
  "Profesor": { prompt: "Eres un 'Profesor' de IA...", greeting: "Hola, soy tu profesor de IA...", icon: "IconBook" as IconName },
  "Jardinero": { prompt: "Eres un 'Jardinero' de IA...", greeting: "¡Hola! Soy tu jardinero virtual...", icon: "IconPlant" as IconName },
  "Informático": { prompt: "Eres un 'Informático' de IA...", greeting: "Hola, soy tu experto en informática...", icon: "IconComputer" as IconName },
  "Viajero": { prompt: "Eres un 'Viajero' de IA...", greeting: "¡Hola, aventurero!...", icon: "IconGlobe" as IconName },
  "Analizador": { prompt: "Eres un 'Analizador' de IA...", greeting: "Hola, soy tu analizador de textos...", icon: "IconSearch" as IconName },
  "Jugón": { prompt: "Eres un 'Jugón' de IA...", greeting: "¡Hey, gamer! Soy tu compañero de IA...", icon: "IconGamepad" as IconName },
  "Bibliotecario": { prompt: "Eres un 'Bibliotecario' de IA...", greeting: "Bienvenido a la biblioteca digital...", icon: "IconLibrary" as IconName },
  "Guía Soc-Cult": { prompt: "Te voy a decir sitios y tú dime...", greeting: "Dime qué sitio vas a visitar...", icon: "IconCompass" as IconName }
};
Object.keys(defaultPersonas).forEach(k => {
  const key = k as keyof typeof defaultPersonas;
  defaultPersonas[key].prompt = defaultPersonas[key].prompt.replace("...", "Tu propósito es ayudar a los usuarios. Formatea tus respuestas con markdown.");
});

// --- TYPES ---
type PersonaData = {
  prompt: string;
  greeting: string;
  icon: IconName;
};
type Persona = PersonaData & { name: string; isDefault?: boolean; };
type Message = { role: 'user' | 'model'; text: string; image?: string; };
type CustomPersonas = { [key: string]: PersonaData };

// --- HELPER FUNCTIONS ---
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

// --- CHAT VIEW COMPONENT ---
const ChatView = ({ persona, onBack, ai }: { persona: Persona, onBack: () => void, ai: GoogleGenAI }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const chatHistoryKey = `chatHistory_${persona.name}`;
    const savedHistory = localStorage.getItem(chatHistoryKey);
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    } else {
      setMessages([{ role: 'model', text: persona.greeting }]);
    }

    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: persona.prompt },
    });
    setChat(newChat);
  }, [persona, ai]);

  useEffect(() => {
    if (messages.length > 0) {
      const chatHistoryKey = `chatHistory_${persona.name}`;
      localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, persona.name]);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [userInput]);
  
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!userInput.trim() && !image) || isLoading || !chat) return;

    const userMessageText = userInput.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessageText, image: image ? URL.createObjectURL(image) : undefined }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    const parts: Part[] = [];
    if (image) {
      try {
        const imagePart = await fileToGenerativePart(image);
        parts.push(imagePart);
      } catch (error) {
        console.error("Error processing image:", error);
        setMessages(prev => [...prev, { role: 'model', text: 'Error al procesar la imagen.' }]);
        setIsLoading(false);
        return;
      }
    }
    if (userMessageText) {
      parts.push({ text: userMessageText });
    }
    setImage(null);

    try {
      const stream = await chat.sendMessageStream({ message: { parts } });
      let modelResponse = '';
      setMessages(prev => [...prev, { role: 'model', text: '' }]);
      
      for await (const chunk of stream) {
        modelResponse += chunk.text;
        setMessages(prev => {
            const updatedMessages = [...prev];
            updatedMessages[updatedMessages.length - 1].text = modelResponse;
            return updatedMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Lo siento, ha ocurrido un error.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleMicClick = () => {
    if (!recognitionRef.current) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Tu navegador no soporta el reconocimiento de voz.");
            return;
        }
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'es-ES';

        recognitionRef.current.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setUserInput(prev => prev.slice(0, prev.length - interimTranscript.length) + finalTranscript);
        };
        recognitionRef.current.onend = () => setIsListening(false);
    }

    if (isListening) {
        recognitionRef.current.stop();
    } else {
        recognitionRef.current.start();
    }
    setIsListening(!isListening);
  };
  
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageIndex(index);
    setTimeout(() => setCopiedMessageIndex(null), 2000);
  };

  return (
    <div className="chat-view">
      <header className="chat-header">
        <h2>{persona.name}</h2>
        <button onClick={onBack} className="back-button">Atrás</button>
      </header>
      <div className="messages-list" role="log" aria-live="polite">
        {messages.map((msg, index) => (
          <div key={index} className={`message-bubble ${msg.role}`}>
            {msg.role === 'model' && msg.text && (
              <button className="copy-button" onClick={() => handleCopy(msg.text, index)} aria-label="Copiar mensaje">
                {copiedMessageIndex === index ? <IconCheck /> : <IconCopy />}
              </button>
            )}
            {msg.image && <img src={msg.image} alt="User upload" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: '8px' }} />}
            <div dangerouslySetInnerHTML={{ __html: md.render(msg.text) }} />
          </div>
        ))}
        {isLoading && <div className="message-bubble model"><div className="loading-indicator"><span/> <span/> <span/></div></div>}
        <div ref={messagesEndRef} />
      </div>
      <div className="message-form-wrapper">
        {image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(image)} alt="Preview" />
            <button className="remove-image-btn" onClick={() => setImage(null)}>&times;</button>
          </div>
        )}
        <form className="message-form" onSubmit={handleSendMessage}>
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setImage(e.target.files[0])} accept="image/*" hidden/>
          <button type="button" className="icon-button" onClick={() => fileInputRef.current?.click()} aria-label="Adjuntar imagen"><IconPaperclip/></button>
          <button type="button" className={`icon-button ${isListening ? 'active' : ''}`} onClick={handleMicClick} aria-label="Usar micrófono"><IconMic/></button>
          <textarea ref={textareaRef} className="message-input" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => {if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}} placeholder="Escribe tu mensaje..." rows={1} disabled={isLoading}/>
          <button type="submit" className="icon-button send-button" disabled={(!userInput.trim() && !image) || isLoading} aria-label="Enviar mensaje">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
          </button>
        </form>
      </div>
    </div>
  );
};

// --- PERSONA EDITOR COMPONENT ---
const PersonaEditor = ({ persona, onSave, onCancel, onDelete }: { persona?: Persona, onSave: (p: PersonaData & { name: string }, isNew: boolean) => void, onCancel: () => void, onDelete?: () => void }) => {
    const [name, setName] = useState(persona?.name || '');
    const [prompt, setPrompt] = useState(persona?.prompt || '');
    const [greeting, setGreeting] = useState(persona?.greeting || '');
    const [icon, setIcon] = useState<IconName>(persona?.icon || 'IconBook');

    const handleSave = () => {
        if (name.trim() && prompt.trim() && greeting.trim()) {
            onSave({ name, prompt, greeting, icon }, !persona);
        }
    };
    
    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{persona ? 'Editar Asistente' : 'Nuevo Asistente'}</h2>
                <div className="form-group">
                    <label htmlFor="name">Nombre</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!!persona && persona.isDefault} />
                </div>
                <div className="form-group">
                    <label htmlFor="prompt">Instrucción de Sistema (Prompt)</label>
                    <textarea id="prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="greeting">Saludo Inicial</label>
                    <textarea id="greeting" value={greeting} onChange={(e) => setGreeting(e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Icono</label>
                    <div className="icon-picker">
                        {(Object.keys(iconMap) as IconName[]).map(iconName => (
                            <div key={iconName} className={`icon-picker-option ${icon === iconName ? 'selected' : ''}`} onClick={() => setIcon(iconName)}>
                                {iconMap[iconName]}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-actions">
                    {persona && !persona.isDefault && onDelete && <button onClick={onDelete} className="modal-button danger">Eliminar</button>}
                    <button onClick={onCancel} className="modal-button secondary">Cancelar</button>
                    <button onClick={handleSave} className="modal-button primary" disabled={!name.trim() || !prompt.trim() || !greeting.trim()}>Guardar</button>
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [editingPersona, setEditingPersona] = useState<Persona | null | 'new'>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [customPersonas, setCustomPersonas] = useState<CustomPersonas>(() => {
    try {
      const saved = localStorage.getItem('customPersonas');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('customPersonas', JSON.stringify(customPersonas));
  }, [customPersonas]);

  useEffect(() => {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          setIsDarkMode(true);
      }
  }, []);

  useEffect(() => {
      document.body.classList.toggle('dark-mode', isDarkMode);
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  if (!process.env.API_KEY) {
      return <div className="app-container"><h1>Error: API_KEY no configurada.</h1></div>
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const handleSavePersona = (p: PersonaData & { name: string }, isNew: boolean) => {
    setCustomPersonas(prev => {
      const newCustom = {...prev};
      newCustom[p.name] = { prompt: p.prompt, greeting: p.greeting, icon: p.icon };
      // if editing and name changed, remove old entry (not supported in this simple UI)
      return newCustom;
    });
    setEditingPersona(null);
  };
  
  const handleDeletePersona = (name: string) => {
    if (window.confirm(`¿Seguro que quieres eliminar al asistente "${name}"?`)) {
        setCustomPersonas(prev => {
            const newCustom = {...prev};
            delete newCustom[name];
            return newCustom;
        });
        localStorage.removeItem(`chatHistory_${name}`);
        setEditingPersona(null);
    }
  };

  if (selectedPersona) {
    return <ChatView persona={selectedPersona} onBack={() => setSelectedPersona(null)} ai={ai} />;
  }

  const allPersonas: Persona[] = [
    ...Object.entries(defaultPersonas).map(([name, data]) => ({ name, ...data, isDefault: true })),
    ...Object.entries(customPersonas).map(([name, data]) => ({ name, ...data, isDefault: false }))
  ];

  return (
    <>
      <main className="app-container" role="main">
        <header className="app-header">
          <h1 className="app-title">All In One IA</h1>
          <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)} aria-label="Cambiar tema">
            {isDarkMode ? <IconSun /> : <IconMoon />}
          </button>
        </header>
        <section className="persona-grid" aria-label="Asistentes de IA">
          {allPersonas.map((p) => (
            <div key={p.name} className="persona-card" onClick={() => setSelectedPersona(p)} onContextMenu={(e) => { e.preventDefault(); if(!p.isDefault) setEditingPersona(p); }}>
              <div className="persona-card-icon">{iconMap[p.icon]}</div>
              <span className="persona-card-name">{p.name}</span>
            </div>
          ))}
          <div className="persona-card new-persona-card" onClick={() => setEditingPersona('new')}>
            <div className="persona-card-icon">{iconMap.IconPlus}</div>
            <span className="persona-card-name">Crear Asistente</span>
          </div>
        </section>
      </main>
      {editingPersona && (
        <PersonaEditor
            persona={editingPersona === 'new' ? undefined : editingPersona}
            onSave={handleSavePersona}
            onCancel={() => setEditingPersona(null)}
            onDelete={editingPersona !== 'new' && !editingPersona.isDefault ? () => handleDeletePersona(editingPersona.name) : undefined}
        />
      )}
    </>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
