import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Mic } from 'lucide-react';
import { chatApi } from '../services/api';
import CopilotPanel from './CopilotPanel';
import { motion, AnimatePresence } from 'framer-motion';
import ProVoicePanel from './ProVoicePanel';
import WellnessDisclaimer from './WellnessDisclaimer';

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

const SessionPanel = ({ open, onClose, therapy, sessionId, onCopilotUpdate }) => {
  const [messages, setMessages] = useState([
    { type: 'ai', text: `Welcome to your ${therapy.name} wellness session! How can I support your personal growth today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showVoicePanel, setShowVoicePanel] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#e0e7ff] via-[#f3e8ff] to-[#f0fdfa]">
      {/* Animated background behind chat card */}
      <div className="absolute inset-0 top-12 left-0 right-0 bottom-0 z-0">
        <AnimatedChatBackground />
      </div>
      {/* Chat Card with glassmorphism and top margin */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative z-10 max-w-6xl w-full mx-4 mt-12 h-[88vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl bg-white/50 backdrop-blur-2xl border border-white/40"
        style={{ boxShadow: '0 8px 40px 0 rgba(80,80,180,0.10), 0 1.5px 8px 0 rgba(80,80,180,0.08)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-neutral-100 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
              <therapy.icon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-primary-700">{therapy.name}</h2>
              <p className="text-neutral-500 text-sm">{therapy.desc}</p>
            </div>
          </div>
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary-500" 
            onClick={() => onClose({ sessionId, therapy, transcript: messages.map(m => m.text).join('\n') })}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Wellness Disclaimer */}
        <div className="px-6 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <WellnessDisclaimer variant="compact" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-transparent">
              <div className="space-y-6 max-w-4xl mx-auto">
                <AnimatePresence>
                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          msg.type === 'user' 
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500' 
                            : 'bg-gradient-to-r from-secondary-400 to-healing-400'
                        }`}>
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        {/* Message Bubble */}
                        <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-full ${
                          msg.type === 'user'
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white'
                            : 'bg-white/90 text-neutral-800 border border-neutral-200 backdrop-blur-sm'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {msg.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {/* Loading Indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-secondary-400 to-healing-400 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/90 px-4 py-3 rounded-2xl border border-neutral-200 shadow-sm backdrop-blur-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            {/* Input Section */}
            <div className="border-t border-neutral-200 bg-transparent px-0">
              <form onSubmit={handleSend} className="flex items-end gap-2 max-w-4xl mx-auto">
                <div className="flex-1 relative flex">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="max-w-xl w-full mx-auto px-3 py-1 pr-10 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-white/90 text-neutral-900 placeholder-neutral-400 resize-none text-sm"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={loading}
                    rows={1}
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
              {/* Voice Chat Note */}
              <div className="text-center mt-2">
                <span className="text-xs text-neutral-400">
                  💡 Try voice chat for a more natural conversation experience
                </span>
              </div>
            </div>
          </div>
          {/* Copilot Panel - Hidden on mobile */}
          <div className="hidden lg:block w-80 border-l border-neutral-200 bg-gradient-to-br from-primary-50 to-secondary-50">
            <div className="p-6 h-full">
              <CopilotPanel sessionId={sessionId} messages={messages} summaryUpdate={onCopilotUpdate} />
            </div>
          </div>
        </div>
      </motion.div>
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
    </div>
  );
};

export default SessionPanel; 