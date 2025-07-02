import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Mic, Menu } from 'lucide-react';
import { chatApi } from '../services/api';
import CopilotPanel from './CopilotPanel';
import { motion, AnimatePresence } from 'framer-motion';
import ProVoicePanel from './ProVoicePanel';
import WellnessDisclaimer from './WellnessDisclaimer';
import VapiButton from './VapiButton';
import AnimatedSessionBackground from './AnimatedSessionBackground';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import { useUser } from './UserContext';
import Vapi from '@vapi-ai/web';

// Animated background SVG blobs
const AnimatedChatBackground = () => (
  <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" style={{mixBlendMode:'multiply'}}>
    <defs>
      <radialGradient id="chatBlob1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a67cff" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#8ec5fc" stopOpacity="0.25" />
      </radialGradient>
      <radialGradient id="chatBlob2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#36aaf7" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#e0c3fc" stopOpacity="0.18" />
      </radialGradient>
    </defs>
    <motion.ellipse
      cx={"25%"}
      cy={180}
      rx={320}
      ry={200}
      fill="url(#chatBlob1)"
      style={{ originX: '0.25', originY: '0.5' }}
      animate={{
        scale: [1, 1.15, 0.95, 1],
        translateY: [0, 30, -30, 0],
        opacity: [0.7, 0.8, 0.5, 0.7],
      }}
      transition={{ duration: 16, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
    <motion.ellipse
      cx={"75%"}
      cy={320}
      rx={260}
      ry={160}
      fill="url(#chatBlob2)"
      style={{ originX: '0.75', originY: '0.7' }}
      animate={{
        scale: [1, 1.12, 0.98, 1],
        translateY: [0, -24, 24, 0],
        opacity: [0.5, 0.6, 0.3, 0.5],
      }}
      transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
  </svg>
);

const AIAvatar = () => (
  <span className="ai-avatar-glow">
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aiGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      <circle cx="22" cy="22" r="20" fill="url(#aiGlow)" />
      <Sparkles x={10} y={10} width={24} height={24} className="text-white" />
    </svg>
  </span>
);

const vapi = new Vapi("de756a08-9d70-4185-b890-5f5b54f7b5bc");

// Helper to format AI replies
function formatAIReply(text) {
  // Detect Markdown/numbered/bulleted lists
  const isList = /(^|\n)(\d+\.|[-*•]) /.test(text);
  if (isList) {
    // Render as list (split by lines)
    const lines = text.split(/\n+/).filter(Boolean);
    if (lines.every(line => /^\d+\./.test(line.trim()))) {
      // Numbered list
      return <ol className="ai-list">{lines.map((item, i) => <li key={i}>{item.replace(/^\d+\./, '').trim()}</li>)}</ol>;
    } else {
      // Bulleted list
      return <ul className="ai-list">{lines.map((item, i) => <li key={i}>{item.replace(/^[-*•]/, '').trim()}</li>)}</ul>;
    }
  }
  // Otherwise, render as paragraphs with pre-line
  return <p style={{marginBottom: 8, whiteSpace: 'pre-line'}}>{text}</p>;
}

const SessionPanel = ({ open, onClose, therapy, sessionId, onCopilotUpdate }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: `Welcome to your ${therapy.name} wellness session! How can I support your personal growth today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showVoicePanel, setShowVoicePanel] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();
  const [voiceON, setVoiceON] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    vapi.on('message', async (message) => {
      if (message.type === 'transcript' && message.text) {
        const res = await fetch('/api/ollama-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: message.text }),
        });
        const data = await res.json();
        if (data.reply) vapi.speak(data.reply);
      }
    });
    return () => vapi.stop();
  }, []);

  const handleVoiceToggle = () => {
    if (!voiceON) {
      vapi.start("77007309-68f9-40bd-8c28-cb1c9db04b3d");
      setVoiceON(true);
    } else {
      vapi.stop();
      setVoiceON(false);
    }
  };

  // Chat send handler
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { type: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    try {
      // Build full chat history as context
      const context = messages.map(m => ({ role: m.type === 'ai' ? 'assistant' : 'user', content: m.text }));
      context.push({ role: 'user', content: input });
      const res = await chatApi.sendMessage(newMsg.text, sessionId, context);
      setMessages((prev) => [...prev, { type: 'ai', text: res.response || 'Sorry, I did not understand that.' }]);
      // Update Copilot summary (placeholder)
      if (onCopilotUpdate) onCopilotUpdate('Copilot is summarizing your session...');
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'ai', text: 'Sorry, there was a problem connecting to the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Voice turn callback
  const handleVoiceTurn = ({ transcribedText, aiResponse }) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: transcribedText },
      { type: 'ai', text: aiResponse },
    ]);
  };

  if (!open) return null;

  return (
    <div className="session-root">
      <AnimatedSessionBackground />
      {/* Floating menu icon for sidebar */}
      <button
        className="floating-menu-btn"
        onClick={() => navigate('/pro-dashboard')}
        aria-label="Open menu"
      >
        <Menu size={28} />
      </button>
      {/* Sidebar overlay (optional, for future expansion) */}
      {/* {sidebarOpen && (
        <SidebarDrawer onClose={() => setSidebarOpen(false)} />
      )} */}
      <div className="session-content">
        {/* Chat Panel */}
        <div className="chat-panel glass-panel">
          {/* Floating X button to close chat */}
          <button
            className="floating-x-btn small"
            onClick={() => onClose && onClose({ sessionId, therapy, transcript: '' })}
            aria-label="Close session"
          >
            <X size={20} />
          </button>
          <div className="chat-messages" style={{ paddingLeft: '40px', paddingRight: '16px' }}>
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring', bounce: 0.5 }}
                  className={`chat-bubble-row ${msg.type}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {msg.type === 'ai' && (
                    <div className="avatar-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44 }}>
                      <AIAvatar />
                    </div>
                  )}
                  <div className="bubble-col" style={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                    <div className={`bubble-content ${msg.type}`}>
                      {msg.type === 'ai' ? formatAIReply(msg.text) : <p>{msg.text}</p>}
                    </div>
                  </div>
                  {msg.type === 'user' && (
                    <div className="avatar-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40, minHeight: 40 }}>
                      <UserAvatar user={user} size="md" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="chat-bubble-row ai" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'flex-start' }}>
                  <div className="avatar-col" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, minHeight: 44 }}>
                    <AIAvatar />
                  </div>
                  <div className="bubble-col" style={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                    <div className="bubble-content ai typing-indicator">
                      <div className="dot"></div>
                      <div className="dot" style={{animationDelay: '0.1s'}}></div>
                      <div className="dot" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div className="input-bar glass-input flex items-center gap-4 justify-between" style={{position:'relative', minHeight: '64px'}}>
            <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto flex-1">
              <div className="flex-1 relative flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="max-w-xl w-full mx-auto px-4 py-4 pr-10 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white/90 text-neutral-900 placeholder-neutral-400 resize-none text-base shadow-md"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                  rows={1}
                  style={{ minHeight: '48px', height: '48px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowVoicePanel(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary-500"
                  disabled={loading}
                >
                  <Mic className="h-4 w-4" />
                </button>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
            {/* Start Emotional Therapy button with badge and voice logic */}
            <div className="flex flex-col items-end ml-4">
              <button
                className={`vapi-premium-btn relative px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 shadow-lg flex items-center gap-2 ${voiceON ? 'listening' : ''}`}
                onClick={handleVoiceToggle}
                style={{ minWidth: 220 }}
              >
                {voiceON ? 'Listening...' : 'Start Emotional Therapy'}
                <span className="plus-badge absolute -top-4 right-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 text-xs font-bold px-3 py-1 rounded-full shadow-md animate-pulse" style={{whiteSpace:'nowrap'}}>Experience the PLUS feature now for a limited time</span>
                {voiceON && <span className="listening-wave"></span>}
              </button>
              <span className="text-xs text-neutral-400 mt-2">💡 Try voice chat for a more natural conversation experience</span>
            </div>
          </div>
        </div>
        {/* Copilot Panel */}
        <div className="copilot-panel glass-panel">
          <div className="p-6 h-full">
            <CopilotPanel sessionId={sessionId} messages={messages} summaryUpdate={onCopilotUpdate} />
          </div>
        </div>
      </div>
      {/* Voice Panel */}
      <AnimatePresence>
        {showVoicePanel && (
          <ProVoicePanel
            open={showVoicePanel}
            onClose={() => setShowVoicePanel(false)}
            therapy={therapy}
            sessionId={sessionId}
            onVoiceTurn={handleVoiceTurn}
          />
        )}
      </AnimatePresence>
      <style>{`
        .session-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          z-index: 50;
        }
        .floating-menu-btn {
          position: absolute;
          top: 32px;
          left: 32px;
          z-index: 100;
          background: rgba(255,255,255,0.7);
          border: none;
          border-radius: 50%;
          box-shadow: 0 2px 12px 0 #a78bfa33;
          padding: 0.5rem;
          cursor: pointer;
          transition: background 0.18s, box-shadow 0.18s;
        }
        .floating-menu-btn:hover {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 24px 0 #a78bfa55;
        }
        .floating-x-btn.small {
          top: 20px;
          right: 20px;
          padding: 0.25rem 0.25rem;
          width: 36px;
          height: 36px;
        }
        .session-content {
          display: flex;
          width: 100vw;
          max-width: 1400px;
          height: 88vh;
          gap: 2.5rem;
          padding: 2.5rem 2rem;
          justify-content: center;
          align-items: stretch;
        }
        .glass-panel {
          background: rgba(255,255,255,0.22);
          backdrop-filter: blur(32px);
          border-radius: 2.5rem;
          box-shadow: 0 12px 48px 0 #a78bfa22, 0 1.5px 8px 0 rgba(80,80,180,0.08);
          border: 1.5px solid rgba(255,255,255,0.22);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          min-height: 80vh;
        }
        .chat-panel {
          flex: 2 1 0%;
          min-width: 0;
          padding: 2rem 1.5rem 1.5rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          margin: 0 0 0 48px;
          box-shadow: -32px 0 64px -24px #a78bfa33, 0 12px 48px 0 #a78bfa22;
        }
        .copilot-panel {
          flex: 1 1 0%;
          min-width: 320px;
          max-width: 420px;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          position: relative;
          margin: 0 48px 0 0;
          min-height: 80vh;
        }
        .chat-messages {
          flex: 1 1 0%;
          overflow-y: auto;
          padding-bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-left: 40px;
          padding-right: 16px;
        }
        .chat-bubble-row {
          width: 100%;
          margin-bottom: 0.5rem;
        }
        .avatar-col {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .bubble-col {
          display: flex;
          align-items: center;
          max-width: 70%;
        }
        .bubble-content {
          flex: 1 1 0%;
          min-width: 60px;
          min-height: 32px;
          display: flex;
          align-items: center;
          word-break: break-word;
          border-radius: 2rem 2rem 2rem 2rem;
          padding: 1rem 1.5rem;
          background: var(--bubble-bg, #fff);
          box-shadow: 0 4px 24px 0 #a78bfa22;
          position: relative;
        }
        .bubble-content.ai {
          background: linear-gradient(120deg, #a8edea 0%, #fed6e3 100%);
          color: #222;
          font-weight: 500;
          font-size: 1.15rem;
          border-radius: 2rem 2rem 2rem 2rem;
          box-shadow: 0 4px 32px 0 #22d3ee22;
          animation: aiBubbleGlow 2.5s infinite alternate;
        }
        .bubble-content.user {
          background: rgba(255,255,255,0.98);
          color: #222;
          font-weight: 600;
          font-size: 1.15rem;
          border-radius: 2rem 2rem 2rem 2rem;
          box-shadow: 0 4px 24px 0 #a78bfa22;
        }
        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        .ai-avatar-glow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, #a78bfa33 0%, transparent 70%);
          box-shadow: 0 0 24px 0 #a78bfa88, 0 2px 12px 0 #22d3ee44;
          animation: aiAvatarPulse 2.2s infinite alternate;
        }
        @keyframes aiAvatarPulse {
          0% { box-shadow: 0 0 24px 0 #a78bfa88, 0 2px 12px 0 #22d3ee44; }
          100% { box-shadow: 0 0 48px 8px #a78bfa88, 0 4px 24px 0 #22d3ee44; }
        }
        .voice-portal-container {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 1.5rem 0 0.5rem 0;
        }
        .input-bar {
          margin-top: 1rem;
          border-radius: 1.5rem;
          background: rgba(255,255,255,0.22);
          box-shadow: 0 2px 12px 0 #a78bfa22;
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border: 1.5px solid #a78bfa44;
          transition: box-shadow 0.2s, border 0.2s;
        }
        .input-bar:focus-within {
          box-shadow: 0 4px 24px 0 #a78bfa55;
          border: 2px solid #a78bfa;
        }
        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #a78bfa;
          animation: bounce 1.2s infinite;
        }
        .dot:nth-child(2) { animation-delay: 0.15s; }
        .dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.7; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
        .vapi-premium-btn {
          background: linear-gradient(90deg, #a78bfa 0%, #fbc2eb 100%);
          color: #fff;
          border: none;
          border-radius: 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          box-shadow: 0 4px 24px 0 #a78bfa44;
          transition: box-shadow 0.18s, background 0.18s;
          position: relative;
          overflow: visible;
        }
        .vapi-premium-btn:hover {
          box-shadow: 0 8px 32px 0 #a78bfa66;
          background: linear-gradient(90deg, #fbc2eb 0%, #a78bfa 100%);
        }
        .plus-badge {
          font-size: 0.85rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          background: linear-gradient(90deg, #fbc2eb 0%, #a78bfa 100%);
          color: #fff;
          box-shadow: 0 2px 8px 0 #a78bfa44;
          top: -1.8rem;
          right: 0.5rem;
          animation: pulseBadge 2s infinite;
        }
        @keyframes pulseBadge {
          0% { box-shadow: 0 2px 8px 0 #a78bfa44; }
          50% { box-shadow: 0 4px 16px 0 #fbc2eb88; }
          100% { box-shadow: 0 2px 8px 0 #a78bfa44; }
        }
        .vapi-premium-btn.listening {
          background: linear-gradient(90deg, #a8edea 0%, #a78bfa 100%);
          box-shadow: 0 0 32px 0 #a78bfa88, 0 4px 32px 0 #22d3ee44;
          animation: pulseBadge 1.2s infinite alternate;
        }
        .vapi-premium-btn.listening .listening-wave {
          position: absolute;
          left: 0; right: 0; top: 0; bottom: 0;
          border-radius: 2rem;
          pointer-events: none;
          z-index: 1;
          background: repeating-linear-gradient(120deg, #a8edea44 0 8%, #a78bfa33 8% 16%, transparent 16% 100%);
          animation: waveGlow 1.2s infinite linear;
        }
        @keyframes waveGlow {
          0% { opacity: 0.7; filter: blur(2px); }
          50% { opacity: 1; filter: blur(6px); }
          100% { opacity: 0.7; filter: blur(2px); }
        }
        .ai-list {
          margin: 0 0 0.5rem 1.2rem;
          padding: 0;
          list-style-type: disc;
        }
        .ai-list li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }
        .bubble-content.ai p {
          white-space: pre-line;
        }
        @media (max-width: 900px) {
          .session-content {
            flex-direction: column;
            gap: 1.5rem;
            padding: 1.2rem 0.5rem;
          }
          .chat-panel, .copilot-panel {
            max-width: 100vw;
            min-width: 0;
            padding: 1rem 0.5rem;
          }
          .copilot-panel {
            max-width: 100vw;
          }
          .floating-menu-btn {
            top: 12px;
            left: 12px;
          }
          .floating-x-btn.small {
            top: 12px;
            right: 12px;
          }
          .chat-panel {
            margin-left: 0;
          }
          .copilot-panel {
            margin-right: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default SessionPanel; 