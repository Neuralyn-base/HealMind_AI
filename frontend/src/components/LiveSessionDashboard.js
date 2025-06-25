import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Clock, Smile, ArrowRight } from 'lucide-react';
import { chatApi } from '../services/api';
import VoiceSessionPanel from './VoiceSessionPanel';

const SESSION_DURATION = 20 * 60; // 20 minutes in seconds

const moodOptions = [
  { icon: <Smile className="h-6 w-6 text-green-400" />, label: 'Great' },
  { icon: <Smile className="h-6 w-6 text-blue-400" />, label: 'Good' },
  { icon: <Smile className="h-6 w-6 text-yellow-400" />, label: 'Okay' },
  { icon: <Smile className="h-6 w-6 text-orange-400" />, label: 'Stressed' },
  { icon: <Smile className="h-6 w-6 text-red-400" />, label: 'Low' },
];

const LiveSessionDashboard = ({ open, onClose, therapy }) => {
  const [secondsLeft, setSecondsLeft] = useState(SESSION_DURATION);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: `Welcome to your ${therapy.title} session! I'm here to support you. How are you feeling right now?`,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [mood, setMood] = useState(null);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const timerRef = useRef();
  const messagesEndRef = useRef(null);
  const [showVoicePanel, setShowVoicePanel] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSecondsLeft(SESSION_DURATION);
    setSessionEnded(false);
    setMood(null);
    setMessages([
      {
        type: 'ai',
        text: `Welcome to your ${therapy.title} session! I'm here to support you. How are you feeling right now?`,
        timestamp: new Date(),
      }
    ]);
  }, [open, therapy]);

  useEffect(() => {
    if (!open || sessionEnded) return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setSessionEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [open, sessionEnded]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Fetch real chat history on mount if sessionId exists
  useEffect(() => {
    if (sessionId) {
      chatApi.getChatHistory(sessionId).then(history => {
        setMessages(history.map(msg => ({
          type: msg.role === 'assistant' ? 'ai' : 'user',
          text: msg.content,
          timestamp: new Date(msg.timestamp),
        })));
      }).catch(() => {});
    }
  }, [sessionId]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || sessionEnded) return;
    const newMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    try {
      const response = await chatApi.sendMessage(newMessage.text, sessionId);
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }
      const aiMessage = {
        type: 'ai',
        text: response.response,
        timestamp: new Date(response.created_at),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Helper to format AI text into paragraphs
  const formatAIText = (text) => {
    return text.split(/\n\s*\n|\n/).map((para, idx) => (
      <p key={idx} className="mb-2 last:mb-0">{para.trim()}</p>
    ));
  };

  // Callback for new voice turn
  const handleVoiceTurn = ({ transcribedText, aiResponse }) => {
    setMessages(prev => [
      ...prev,
      { type: 'user', text: transcribedText, timestamp: new Date() },
      { type: 'ai', text: aiResponse, timestamp: new Date() },
    ]);
  };

  // Instead of toggling mic, open the voice session panel
  const handleMicClick = () => {
    setShowVoicePanel(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full p-0 sm:p-8 relative animate-scale-in flex flex-col h-[90vh] min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <therapy.icon className="h-7 w-7" />
            </div>
            <div>
              <div className="font-bold text-xl text-primary-700">{therapy.title}</div>
              <div className="text-neutral-500 text-sm">{therapy.description}</div>
            </div>
          </div>
          <button className="text-neutral-400 hover:text-primary-500 transition-colors" onClick={onClose} aria-label="Close">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Timer & Progress */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary-500" />
            <span className="font-medium text-primary-700">Session Time Left:</span>
            <span className="font-mono text-lg text-neutral-800">{formatTime(secondsLeft)}</span>
          </div>
          <div className="w-40 h-2 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500" style={{ width: `${(secondsLeft/SESSION_DURATION)*100}%` }}></div>
          </div>
        </div>

        {/* Mood Check-in */}
        {!mood && !sessionEnded && (
          <div className="p-8 flex flex-col items-center justify-center flex-1 min-h-0">
            <h3 className="text-2xl font-bold text-primary-700 mb-4">How are you feeling right now?</h3>
            <div className="flex gap-4 mb-8">
              {moodOptions.map((option) => (
                <button key={option.label} className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-neutral-50 hover:bg-primary-50 border-2 border-neutral-100 hover:border-primary-300 transition-all" onClick={() => setMood(option.label)}>
                  {option.icon}
                  <span className="text-xs text-neutral-600 font-medium mt-1">{option.label}</span>
                </button>
              ))}
            </div>
            <p className="text-neutral-500 text-sm max-w-md text-center">Your mood helps us personalize your session and track your progress over time.</p>
          </div>
        )}

        {/* Chat & Voice Section */}
        {mood && !sessionEnded && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Chat Area */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-gradient-to-br from-neutral-50 to-primary-50">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                    <div className={`flex items-start space-x-3 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-xl ${message.type === 'user' ? 'bg-primary-500' : 'bg-gradient-to-r from-secondary-400 to-healing-400'}`}>
                        <Smile className="h-5 w-5 text-white" />
                      </div>
                      <div className={`p-4 rounded-2xl break-words whitespace-pre-line shadow-sm ${message.type === 'user' ? 'bg-primary-500 text-white' : 'bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-800'} max-w-[32rem]`} style={{wordBreak: 'break-word'}}>
                        {message.type === 'ai' ? formatAIText(message.text) : <span>{message.text}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-secondary-400 to-healing-400 rounded-xl">
                        <Smile className="h-5 w-5 text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-neutral-100 to-neutral-50 p-4 rounded-2xl">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
            {/* Voice Controls */}
            <div className="flex items-center gap-4 px-6 py-3 bg-white border-t border-neutral-100">
              <button onClick={handleMicClick} className={`p-3 rounded-xl bg-primary-100 text-primary-600 transition-all`}>
                <Mic className="h-5 w-5" />
              </button>
              <button onClick={() => setIsMuted((v) => !v)} className={`p-3 rounded-xl ${!isMuted ? 'bg-primary-100 text-primary-600' : 'bg-neutral-100 text-neutral-400'} transition-all`}>
                {!isMuted ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </button>
              <div className="flex-1"></div>
              <form className="flex-1 flex items-center gap-3" onSubmit={e => { e.preventDefault(); handleSendMessage(); }}>
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message or use the mic..."
                  className="flex-1 p-4 border border-neutral-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                  disabled={sessionEnded}
                />
                <button type="submit" className="px-5 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!inputValue.trim() || isTyping || sessionEnded}>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Session Ended */}
        {sessionEnded && (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Session Ended</h2>
            <p className="text-neutral-600 mb-6 text-center">Your free session has ended. Upgrade to Pro for unlimited access, advanced features, and more therapy types!</p>
            <button className="btn-primary text-lg mb-4">Upgrade to Pro</button>
            <button className="btn-secondary text-lg" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
      {showVoicePanel && (
        <VoiceSessionPanel
          open={showVoicePanel}
          onClose={() => setShowVoicePanel(false)}
          therapy={therapy}
          sessionId={sessionId}
          onVoiceTurn={handleVoiceTurn}
        />
      )}
    </div>
  );
};

export default LiveSessionDashboard; 