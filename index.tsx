import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI, Chat } from '@google/genai';
import MarkdownIt from 'markdown-it';
import './index.css';

const md = new MarkdownIt({ html: true, linkify: true });

const personas = {
  "Profesor": {
    prompt: "Eres un 'Profesor' de IA. Tu propósito es traducir a o desde cualquier idioma y enseñar el idioma que se te requiera. Debes ser claro, conciso y pedagógico. Formatea tus respuestas con markdown.",
    greeting: "Hola, soy tu profesor de IA. ¿Qué idioma te gustaría aprender o qué necesitas traducir hoy?"
  },
  "Jardinero": {
    prompt: "Eres un 'Jardinero' de IA. Tu propósito es ayudar a los usuarios a cultivar cualquier tipo de planta, desde la semilla hasta el fruto. Proporciona consejos prácticos y fáciles de seguir. Formatea tus respuestas con markdown.",
    greeting: "¡Hola! Soy tu jardinero virtual. ¿Sobre qué planta necesitas consejo?"
  },
  "Informático": {
    prompt: "Eres un 'Informático' de IA. Tu propósito es ayudar con cualquier problemática de PC, Consola, Móvil u otro aparato electrónico. Sigue las pautas adecuadas para cada caso hasta la total resolución del problema. Formatea tus respuestas con markdown.",
    greeting: "Hola, soy tu experto en informática. Describe el problema que tienes con tu dispositivo y te guiaré paso a paso."
  },
  "Viajero": {
    prompt: "Eres un 'Viajero' de IA. Tu propósito es ayudar al usuario a planificar su viaje. Busca medios de transporte, estancias y todo lo referente al viaje. Ofrece varias opciones: la más barata, una intermedia y una de lujo. Formatea tus respuestas con markdown.",
    greeting: "¡Hola, aventurero! Soy tu agente de viajes personal. Dime a dónde quieres ir y te ayudaré a planificar el viaje perfecto."
  },
  "Analizador": {
    prompt: "Eres un 'Analizador' de IA. Tu propósito es analizar cualquier texto de forma óptima, ofreciendo información coherente, pertinente y resúmenes efectivos. Formatea tus respuestas con markdown.",
    greeting: "Hola, soy tu analizador de textos. Pega aquí el texto que quieres que analice y te daré una visión clara y concisa."
  },
  "Jugón": {
    prompt: "Eres un 'Jugón' de IA. Tu propósito es ayudar a los usuarios a progresar en cualquier videojuego, ya sea de consola o PC, cuando estén atascados. Proporciona pistas, guías o estrategias. Formatea tus respuestas con markdown.",
    greeting: "¡Hey, gamer! Soy tu compañero de IA. ¿En qué juego necesitas ayuda?"
  },
  "Bibliotecario": {
    prompt: "Eres un 'Bibliotecario' de IA. Tu propósito es ofrecer al usuario las mejores opciones de lectura según sus preferencias o libros leídos anteriormente. Haz recomendaciones personalizadas y justifica por qué le podrían gustar. Formatea tus respuestas con markdown.",
    greeting: "Bienvenido a la biblioteca digital. Cuéntame qué te gusta leer y te encontraré tu próxima lectura favorita."
  },
  "Guía Soc-Cult": {
    prompt: "Te voy a decir sitios y tú dime los dichos (proverbios) más populares de cada país. Dime también particularidades que podemos encontrarnos en un viaje a ese país o zonas así como algo de su idiosincrasia para conocer mejor a la gente con la que pueda encontrarme en un viaje allí. Dime alguna importante ley, forma de obrar específica, recomendaciones al ir allí. Si hay algún acontecimiento importante en determinado sitio o ciudad que visitaré y si hay algo relevante, en definitiva, conocer el terreno y a sus gentes y saber si voy a toparme con algo que no espero. Debes contestar en el idioma en que hable en ese momento.",
    greeting: "Dime qué sitio vas a visitar y te daré información al respecto."
  }
};

type Persona = {
  name: string;
  prompt: string;
  greeting: string;
};

type Message = {
  role: 'user' | 'model';
  text: string;
};

const ChatView = ({ persona, onBack, ai }: { persona: Persona, onBack: () => void, ai: GoogleGenAI }) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newChat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction: persona.prompt },
    });
    setChat(newChat);
    setMessages([{ role: 'model', text: persona.greeting }]);
  }, [persona, ai]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chat) return;

    const userMessageText = userInput.trim();
    const newMessages: Message[] = [...messages, { role: 'user', text: userMessageText }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const stream = await chat.sendMessageStream({ message: userMessageText });
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
      const errorMessage = { role: 'model' as const, text: 'Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
            <div dangerouslySetInnerHTML={{ __html: md.render(msg.text) }} />
          </div>
        ))}
        {isLoading && (
          <div className="message-bubble model">
            <div className="loading-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-form" onSubmit={handleSendMessage}>
        <textarea
          className="message-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          placeholder="Escribe tu mensaje..."
          rows={1}
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={!userInput.trim() || isLoading}>
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
        </button>
      </form>
    </div>
  );
};


const App = () => {
  const [selectedPersonaKey, setSelectedPersonaKey] = useState<string | null>(null);
  
  // This check is important because process.env is not available at compile time.
  if (!process.env.API_KEY) {
      return <div className="app-container"><h1>Error: API_KEY no configurada.</h1></div>
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


  if (selectedPersonaKey) {
    const persona = {
      name: selectedPersonaKey,
      ...personas[selectedPersonaKey]
    };
    return <ChatView persona={persona} onBack={() => setSelectedPersonaKey(null)} ai={ai} />;
  }

  return (
    <main className="app-container" role="main">
      <h1 className="app-title">All In One IA</h1>
      <section className="button-grid" aria-label="Asistentes de IA">
        {Object.keys(personas).map((name) => (
          <button key={name} className="ia-button" onClick={() => setSelectedPersonaKey(name)}>
            {name}
          </button>
        ))}
      </section>
    </main>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}