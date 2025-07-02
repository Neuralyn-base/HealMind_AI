import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BarChart2, MessageCircle, Settings, Smile, TrendingUp, Sparkles, Menu, X, LogOut, Upload, Camera, Calendar, ArrowLeft, CheckCircle2, Target } from 'lucide-react';
import { useUser } from './UserContext';
import { chatApi } from '../services/api';
import CopilotPanel from './CopilotPanel';
import SessionPanel from './SessionPanel';
import { useNavigate } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import TherapySelectionModal from './TherapySelectionModal';
import AnalyticsCard from './AnalyticsCard';
import WellnessDisclaimer from './WellnessDisclaimer';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Make moodValueMap available everywhere in this file
const moodValueMap = { Great: 95, Good: 85, Okay: 70, Stressed: 50, Low: 30 };

const sidebarItems = [
  { icon: <User />, label: 'Profile' },
  { icon: <MessageCircle />, label: 'Sessions' },
  { icon: <BarChart2 />, label: 'Analytics' },
  { icon: <Settings />, label: 'Settings' },
];

const tips = [
  'Remember: Every feeling is valid.',
  'Small steps lead to big changes.',
  'You are not alone on this journey.',
  'Take a deep breath and be kind to yourself.',
  'Progress, not perfection.'
];

const mockHistory = [
  { date: '2024-06-01', summary: 'Discussed work stress, practiced breathing.' },
  { date: '2024-05-28', summary: 'Explored coping strategies for anxiety.' },
  { date: '2024-05-25', summary: 'Mood check-in and gratitude journaling.' },
];

const mockMoodData = [
  { day: 1, date: '2024-03-01', mood: 50, note: 'Feeling stressed' },
  { day: 2, date: '2024-03-02', mood: 95, note: 'Great progress today' },
  { day: 3, date: '2024-03-03', mood: 85, note: 'Good meditation session' },
  { day: 4, date: '2024-03-04', mood: 85, note: 'Productive day' },
  { day: 5, date: '2024-03-05', mood: 95, note: 'Excellent therapy session' },
  { day: 6, date: '2024-03-06', mood: 50, note: 'Challenging day' },
  { day: 7, date: '2024-03-07', mood: 95, note: 'Feeling optimistic' },
  { day: 8, date: '2024-03-08', mood: 75, note: 'Making progress' },
  { day: 9, date: '2024-03-09', mood: 80, note: 'Good energy' },
  { day: 10, date: '2024-03-10', mood: 90, note: 'Feeling confident' }
];

// Calculate analytics from mock data
const analyticsMoodAvg = Math.round(mockMoodData.reduce((acc, day) => acc + day.mood, 0) / mockMoodData.length);
const moodImprovement = Math.max(0, mockMoodData[mockMoodData.length - 1].mood - mockMoodData[0].mood);

const sessionStats = {
  thisMonth: 60,
  thisWeek: 12,
  lastWeek: 8,
  averageDuration: 20,
  completionRate: '95%',
  consistencyScore: '88%',
  totalMinutes: 1240,
  preferredTime: 'Evening',
  longestStreak: '14 days',
  missedSessions: 3
};

// Mock analytics data
const mockAnalytics = {
  loading: false,
  error: null,
  data: {
    moodAverage: analyticsMoodAvg,
    moodImprovement: moodImprovement,
    sessionsCompleted: sessionStats.thisMonth,
    totalMinutes: sessionStats.totalMinutes,
    consistencyScore: sessionStats.consistencyScore,
    completionRate: sessionStats.completionRate
  }
};

const therapyTypes = [
  { 
    key: 'cbt', 
    name: 'Cognitive Behavioral Therapy', 
    desc: 'Evidence-based approach to identify and change negative thought patterns and behaviors',
    icon: Smile, 
    usage: 85,
    benefits: ['Reduces anxiety and depression', 'Improves emotional regulation', 'Builds resilience'],
    sessions: 45
  },
  { 
    key: 'mindfulness', 
    name: 'Mindfulness Therapy', 
    desc: 'Present-moment awareness and acceptance techniques for emotional well-being',
    icon: Sparkles, 
    usage: 75,
    benefits: ['Reduces stress', 'Enhances focus', 'Promotes emotional balance'],
    sessions: 38
  }
];

// Animated mood icons (SVGs or emojis)
const moodOptions = [
  { label: 'Great', icon: '😄', color: 'bg-green-100', glow: 'shadow-green-300' },
  { label: 'Good', icon: '😊', color: 'bg-blue-100', glow: 'shadow-blue-300' },
  { label: 'Okay', icon: '😐', color: 'bg-yellow-100', glow: 'shadow-yellow-300' },
  { label: 'Stressed', icon: '😣', color: 'bg-orange-100', glow: 'shadow-orange-300' },
  { label: 'Low', icon: '😔', color: 'bg-red-100', glow: 'shadow-red-300' },
];

// Mood emoji map
const moodEmoji = {
  Great: '😄',
  Good: '😊',
  Okay: '😐',
  Stressed: '😣',
  Low: '😔',
  Happy: '😁',
};

// Animated floating blobs for backgrounds
const AnimatedBlobs = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{mixBlendMode:'multiply'}}>
    <defs>
      <radialGradient id="blobGrad1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a67cff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#8ec5fc" stopOpacity="0.1" />
      </radialGradient>
      <radialGradient id="blobGrad2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#36aaf7" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#e0c3fc" stopOpacity="0.08" />
      </radialGradient>
    </defs>
    <motion.ellipse
      cx={"30%"}
      cy={120}
      rx={120}
      ry={80}
      fill="url(#blobGrad1)"
      style={{ originX: '0.3', originY: '0.5' }}
      animate={{
        scale: [1, 1.15, 0.95, 1],
        translateY: [0, 15, -15, 0],
        opacity: [0.5, 0.7, 0.4, 0.5],
      }}
      transition={{ duration: 8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
    <motion.ellipse
      cx={"70%"}
      cy={180}
      rx={100}
      ry={70}
      fill="url(#blobGrad2)"
      style={{ originX: '0.7', originY: '0.7' }}
      animate={{
        scale: [1, 1.12, 0.98, 1],
        translateY: [0, -15, 15, 0],
        opacity: [0.4, 0.6, 0.3, 0.4],
      }}
      transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    />
  </svg>
);

// Replace LoadingOverlay with a beautiful morphing blob spinner
const MorphingBlobLoader = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm">
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="blobGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8b500" />
          <stop offset="60%" stopColor="#a8edea" />
          <stop offset="100%" stopColor="#fceabb" />
        </radialGradient>
      </defs>
      <path>
        <animate attributeName="d" dur="2s" repeatCount="indefinite"
          values="M60,20 Q90,30 80,60 Q90,90 60,100 Q30,90 40,60 Q30,30 60,20Z;
                  M60,20 Q100,40 80,60 Q100,100 60,100 Q20,100 40,60 Q20,40 60,20Z;
                  M60,20 Q90,30 80,60 Q90,90 60,100 Q30,90 40,60 Q30,30 60,20Z" />
        <animate attributeName="fill" values="url(#blobGradient);#f8b500;url(#blobGradient)" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
    <span className="absolute top-[60%] text-xl font-bold text-yellow-600 animate-pulse">Preparing your session...</span>
  </div>
);

const LiquidGlassBackground = () => (
  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}>
      <defs>
        <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="60" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0.8 0 0 0 0  0 0.8 0 0 0  0 0 0.9 0 0  0 0 0 0.3 0" result="liquid" />
          <feBlend in="SourceGraphic" in2="liquid" mode="lighten" />
        </filter>
      </defs>
      <g filter="url(#liquid)">
        <motion.path
          d="M 0 600 Q 360 400 720 600 T 1440 600 V 900 H 0 Z"
          fill="url(#paint0_linear)"
          animate={{
            d: [
              'M 0 600 Q 360 400 720 600 T 1440 600 V 900 H 0 Z',
              'M 0 620 Q 400 420 720 620 T 1440 620 V 900 H 0 Z',
              'M 0 600 Q 360 400 720 600 T 1440 600 V 900 H 0 Z',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <linearGradient id="paint0_linear" x1="0" y1="600" x2="1440" y2="900" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a8edea" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fed6e3" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fcb69f" stopOpacity="0.7" />
        </linearGradient>
      </g>
    </svg>
    <div className="absolute top-0 left-0 w-full h-full" style={{backdropFilter:'blur(32px)',opacity:0.7}}></div>
  </div>
);

// Add this new component above ProDashboard:
const TopGradientBackground = () => (
  <div className="absolute top-0 left-0 w-full h-[340px] z-0 pointer-events-none">
    <svg width="100%" height="100%" viewBox="0 0 1440 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{position:'absolute',top:0,left:0,width:'100%',height:'100%'}}>
      <defs>
        <linearGradient id="topLiquid" x1="0" y1="0" x2="1440" y2="340" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a8edea" stopOpacity="0.7" />
          <stop offset="0.5" stopColor="#fed6e3" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fcb69f" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <motion.rect
        width="1440"
        height="340"
        fill="url(#topLiquid)"
        animate={{
          y: [0, 10, -10, 0],
          opacity: [0.85, 1, 0.85, 0.95]
        }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </svg>
    <div className="absolute top-0 left-0 w-full h-full" style={{backdropFilter:'blur(24px)',opacity:0.7}}></div>
  </div>
);

// Add this at the top of the file:
const DashboardLiquidBG = () => (
  <div className="dashboard-liquid-bg">
    <svg viewBox="0 0 1440 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="green" cx="60%" cy="40%" r="60%" gradientTransform="rotate(20)">
          <stop offset="0%" stop-color="#a8edea" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#a8edea" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="pink" cx="30%" cy="70%" r="60%" gradientTransform="rotate(-10)">
          <stop offset="0%" stop-color="#fed6e3" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#fed6e3" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="orange" cx="80%" cy="80%" r="60%">
          <stop offset="0%" stop-color="#fcb69f" stop-opacity="0.7" />
          <stop offset="100%" stop-color="#fcb69f" stop-opacity="0" />
        </radialGradient>
      </defs>
      <motion.ellipse
        cx="900" cy="300" rx="420" ry="260"
        fill="url(#green)"
        animate={{
          cy: [300, 320, 280, 300],
          rx: [420, 440, 400, 420],
          opacity: [0.7, 0.85, 0.7, 0.8]
        }}
        transition={{ duration: 18, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="400" cy="700" rx="380" ry="220"
        fill="url(#pink)"
        animate={{
          cy: [700, 680, 720, 700],
          rx: [380, 400, 360, 380],
          opacity: [0.7, 0.85, 0.7, 0.8]
        }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx="1200" cy="900" rx="320" ry="180"
        fill="url(#orange)"
        animate={{
          cy: [900, 880, 940, 900],
          rx: [320, 340, 300, 320],
          opacity: [0.7, 0.85, 0.7, 0.8]
        }}
        transition={{ duration: 26, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />
    </svg>
  </div>
);

// Add subcomponents inside ProDashboard:
function PrivacyModal({ open, onClose, user, analytics, onExport, onDelete }) {
  const [dataSharing, setDataSharing] = useState(true);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xl animate-fade-in">
      <div className="glass rounded-3xl shadow-2xl max-w-lg w-full p-0 sm:p-10 relative animate-scale-in flex flex-col">
        <button className="absolute top-6 right-6 text-neutral-400 hover:text-primary-500 transition-colors" onClick={onClose} aria-label="Close">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="text-center mb-8 mt-4">
          <h2 className="text-3xl font-bold text-primary-800 mb-2">Privacy Settings</h2>
          <p className="text-neutral-700 text-md font-medium">Manage your data and privacy preferences</p>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Data Sharing</span>
            <input type="checkbox" checked={dataSharing} onChange={()=>setDataSharing(v=>!v)} className="w-5 h-5 accent-primary-500" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-700">Analytics & Insights</span>
            <input type="checkbox" checked={analyticsOptIn} onChange={()=>setAnalyticsOptIn(v=>!v)} className="w-5 h-5 accent-primary-500" />
          </div>
          <div className="bg-neutral-50 rounded-xl p-4 text-neutral-600 text-sm border border-neutral-200">
            <b>Privacy Policy:</b> Your data is encrypted and never sold. You can export or delete your data at any time. For more details, see our <a href="/privacy-policy" className="underline text-primary-500">full privacy policy</a>.
          </div>
          <div className="flex flex-col gap-3">
            <button className="w-full bg-gradient-to-r from-healing-500 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={onExport}>📥 Export My Data</button>
            <button className="w-full bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" onClick={onDelete}>🗑️ Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function NeuralynAvatarSVG({ size = 28 }) {
  // A stylized brain/chat bubble with sparkles (luxury accent)
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="neuralynGradient" cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#a67cff" />
          <stop offset="100%" stopColor="#36aaf7" />
        </radialGradient>
        <linearGradient id="luxuryGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f7e8b4" />
          <stop offset="100%" stopColor="#a67cff" />
        </linearGradient>
      </defs>
      <ellipse cx="16" cy="16" rx="14" ry="13" fill="url(#neuralynGradient)" opacity="0.9" />
      <path d="M10 18c0-4 4-7 6-7s6 3 6 7c0 2-2 4-6 4s-6-2-6-4z" fill="#fff" opacity="0.9" />
      <circle cx="12" cy="14" r="1.2" fill="#a67cff" />
      <circle cx="20" cy="14" r="1.2" fill="#36aaf7" />
      <path d="M16 22c2 0 3.5-1 3.5-1.5" stroke="url(#luxuryGold)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="25" cy="9" r="1.2" fill="url(#luxuryGold)" />
      <circle cx="7" cy="10" r="0.7" fill="#f7e8b4" />
    </svg>
  );
}
function OnlineDotSVG({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7" cy="7" r="6" fill="#a7ffb0" opacity="0.7" />
      <circle cx="7" cy="7" r="4" fill="#22c55e" />
      <circle cx="7" cy="7" r="2" fill="#fff" opacity="0.7" />
    </svg>
  );
}
function SupportChatModal({ open, onClose, user }) {
  const [messages, setMessages] = useState([
    { type: 'ai', text: `Hi${user?.name ? ' ' + user.name.split(' ')[0] : ''}, I'm your Neuralyn Support Assistant. How can I help you with HealMind AI today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, loading]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);
  const systemPrompt = `You are Neuralyn Support Assistant, a friendly, empathetic, and knowledgeable support agent for HealMind AI. Always answer as Neuralyn, never as a generic AI. If asked 'Who are you?', reply: 'I'm your Neuralyn Support Assistant, here to help you with anything related to HealMind AI and your wellness journey.' If asked to connect to an agent, reply: 'Our human support team is available at contact@neuralyn.health. For urgent issues, please email us directly. I can help with most questions right here!'`;
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { type: 'user', text: input }]);
    setInput('');
    setLoading(true);
    try {
      if (/who are you|what are you|are you ai|are you a bot/i.test(input)) {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'ai', text: "I'm your Neuralyn Support Assistant, here to help you with anything related to HealMind AI and your wellness journey." }]);
          setLoading(false);
        }, 800);
        return;
      }
      if (/connect.*agent|human|real person|talk.*person/i.test(input)) {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'ai', text: 'Our human support team is available at contact@neuralyn.health. For urgent issues, please email us directly. I can help with most questions right here!' }]);
          setLoading(false);
        }, 800);
        return;
      }
      if (/contact|email|support|help|issue|problem/i.test(input)) {
        setTimeout(() => {
          setMessages(prev => [...prev, { type: 'ai', text: 'For account or urgent issues, please email us at contact@neuralyn.health.' }]);
          setLoading(false);
        }, 800);
        return;
      }
      const res = await chatApi.sendMessage(systemPrompt + '\nUser: ' + input, sessionId);
      if (!sessionId && res.session_id) setSessionId(res.session_id);
      setMessages(prev => [...prev, { type: 'ai', text: res.response || 'Sorry, I did not understand that.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { type: 'ai', text: 'Sorry, there was a problem connecting to support. Please email contact@neuralyn.health.' }]);
    } finally {
      setLoading(false);
    }
  };
  return open ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#f7e8ff]/80 to-[#e0f7fa]/80 backdrop-blur-2xl animate-fade-in">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full p-0 sm:p-10 relative animate-scale-in flex flex-col border border-primary-100 luxury-border" style={{maxHeight:'90vh', boxShadow:'0 8px 48px 0 #a67cff33, 0 1.5px 0 0 #f7e8b4'}}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-[#a67cff] via-[#f7e8b4] to-[#36aaf7] rounded-t-3xl relative luxury-header">
          <div className="p-2 bg-white/20 rounded-xl flex items-center justify-center">
            <NeuralynAvatarSVG size={32} />
          </div>
          <span className="font-semibold text-lg text-white luxury-title">Neuralyn Support Chat</span>
          <span className="ml-auto"><OnlineDotSVG size={18} /></span>
          <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors" onClick={onClose} aria-label="Close">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Chat Body */}
        <div className="flex-1 h-96 bg-gradient-to-br from-white/95 to-[#f7e8ff]/80 p-6 overflow-y-auto flex flex-col" style={{minHeight:'320px'}}>
          <div className="space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}>
                <div className={`flex items-start space-x-3 max-w-xs ${m.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {m.type === 'ai' && <div className="p-2"><NeuralynAvatarSVG size={24} /></div>}
                  <div className={`p-4 rounded-3xl shadow-lg ${m.type === 'user' ? 'bg-gradient-to-r from-[#36aaf7] to-[#a67cff] text-white border-2 border-[#a67cff]' : 'bg-white border-2 border-[#f7e8b4] luxury-bubble'}`}
                    style={m.type === 'ai' ? {boxShadow:'0 2px 12px #a67cff22', borderLeft:'4px solid #a67cff', background:'linear-gradient(135deg, #fff 90%, #f7e8b4 100%)'} : {boxShadow:'0 2px 12px #36aaf722'}}>
                    <p className="text-base leading-relaxed whitespace-pre-line font-medium luxury-text">{m.text}</p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-slide-up"><div className="flex items-start space-x-3"><div className="p-2"><NeuralynAvatarSVG size={24} /></div><div className="bg-white border-2 border-[#f7e8b4] p-4 rounded-3xl shadow-lg luxury-bubble"><div className="flex space-x-2"><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div><div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div></div></div></div></div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>
        {/* Input */}
        <form className="flex items-center gap-2 p-4 border-t border-neutral-100 bg-white/80 rounded-b-3xl" onSubmit={handleSend}>
          <input ref={inputRef} className="flex-1 px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-400 text-base" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." />
          <button type="submit" className="bg-gradient-to-r from-[#a67cff] to-[#36aaf7] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200 luxury-send">Send</button>
        </form>
        {/* Footer Badge */}
        <div className="text-xs text-center py-2 font-semibold" style={{background:'linear-gradient(90deg, #f7e8b4 0%, #a67cff 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>Powered by Neuralyn</div>
      </div>
    </div>
  ) : null;
}

// Add a toast component for 'Coming Soon'
function ComingSoonToast({ show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);
  if (!show) return null;
  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gradient-to-r from-[#a67cff] to-[#36aaf7] text-white px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-fade-in">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#f7e8b4"/><path d="M12 7v5l3 3" stroke="#a67cff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span className="font-semibold text-lg">Coming Soon!</span>
      </div>
    </div>
  );
}

const ProDashboard = () => {
  const { user, mood, setMood, logout, updateProfilePhoto } = useUser();
  const navigate = useNavigate();
  // All state declarations must come first
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('Session');
  const [showSession, setShowSession] = useState(true);
  const [messages, setMessages] = useState([
    { type: 'ai', text: `Hi ${user?.name?.split(' ')[0] || 'there'}, how can I support you today?` },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const chatEndRef = useRef(null);
  const [popup, setPopup] = useState(null); // 'Profile', 'Sessions', 'Analytics', 'Settings' or null
  const [showMoodCheck, setShowMoodCheck] = useState(false);
  const [activeTherapy, setActiveTherapy] = useState(null);
  const [inProgressSession, setInProgressSession] = useState(null); // {therapy, sessionId}
  const [showSessionPanel, setShowSessionPanel] = useState(false);
  const [currentSession, setCurrentSession] = useState(null); // {therapy, sessionId}
  const [copilotSummary, setCopilotSummary] = useState('');
  const [viewSummary, setViewSummary] = useState(null); // session object or null
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [copilotSummaries, setCopilotSummaries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState(null);
  const [aiInsight, setAIInsight] = useState('');
  const [aiInsightLoading, setAIInsightLoading] = useState(true);
  const [aiInsightError, setAIInsightError] = useState(null);
  // Profile photo upload state
  const [previewUrl, setPreviewUrl] = useState(user?.profilePhoto || null);
  const fileInputRef = useRef(null);
  // In the ProDashboard component, after state declarations:
  const [analyticsSessions, setAnalyticsSessions] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(true);
  const [aiInsightsError, setAiInsightsError] = useState(null);
  // Add at the top of ProDashboard component:
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'Light');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'Small');
  const [animations, setAnimations] = useState(localStorage.getItem('animations') !== 'false');
  const [notifications, setNotifications] = useState(() => {
    const n = localStorage.getItem('notifications');
    return n ? JSON.parse(n) : { session: true, mood: true, weekly: false };
  });
  // Persist settings
  useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
  useEffect(() => { localStorage.setItem('fontSize', fontSize); }, [fontSize]);
  useEffect(() => { localStorage.setItem('animations', animations); }, [animations]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);

  // Fix: isDesktop must be defined before use
  const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 768;

  // Redirect free users to free dashboard
  useEffect(() => {
    if (user && !user.isPro) {
      navigate('/free-dashboard', { replace: true });
    }
  }, [user, navigate]);

  // Ensure Pro users are always on /pro-dashboard when opening session modal
  useEffect(() => {
    if (user && user.isPro && popup === 'Sessions' && window.location.pathname !== '/pro-dashboard') {
      navigate('/pro-dashboard', { replace: true });
    }
  }, [user, popup, navigate]);

  const today = new Date().toLocaleDateString();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Sidebar navigation handler
  const handleSidebarItemClick = (label) => {
    setPopup(label);
    setSidebarOpen(false);
  };

  // Chat send handler (real backend)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { type: 'user', text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatApi.sendMessage(newMsg.text, sessionId);
      if (!sessionId && res.session_id) setSessionId(res.session_id);
      setMessages((prev) => [...prev, { type: 'ai', text: res.response || 'Sorry, I did not understand that.' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { type: 'ai', text: 'Sorry, there was a problem connecting to the AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Helper: fetch session history for this user from backend
  const fetchSessions = async () => {
    try {
      const sessions = await chatApi.getAllSessions();
      // Only include sessions for the current user
      const filtered = user?.email ? sessions.filter(s => s.user_id === user.email) : sessions;
      setSessionHistory(filtered);
    } catch (err) {
      // fallback to localStorage if backend fails
      setSessionHistory(getSessionHistory());
    }
  };

  // Helper: fetch session history for this user
  const getSessionHistory = () => {
    if (!user?.email) return [];
    return JSON.parse(localStorage.getItem(`sessions_${user.email}`) || '[]');
  };

  // On session/coplan update, save to user-specific keys
  const saveSessionHistory = (sessions) => {
    if (user?.email) {
      localStorage.setItem(`sessions_${user.email}`, JSON.stringify(sessions));
      setSessionHistory(sessions);
    }
  };
  const saveCopilotSummaries = (summaries) => {
    if (user?.email) {
      localStorage.setItem(`copilot_${user.email}`, JSON.stringify(summaries));
      setCopilotSummaries(summaries);
    }
  };

  // Handler to start a new session
  const handleStartSession = async (therapy) => {
    setLoading(true);
    try {
      // Map therapy object if it comes from TherapySelectionModal (title/description)
      const mappedTherapy = therapy.title ? {
        key: therapy.key,
        name: therapy.title,
        desc: therapy.description,
        icon: therapy.icon
      } : therapy;
      const session = await chatApi.createSession(mappedTherapy, user.email);
      setCurrentSession({ therapy: mappedTherapy, sessionId: session.session_id });
      setShowSessionPanel(true);
      setPopup(null);
      // Update localStorage and state immediately
      let sessions = getUserSessions(user);
      sessions = [{ ...session, user: user.email }, ...sessions];
      setUserSessions(user, sessions);
      setAnalyticsSessions(sessions);
    } catch (err) {
      alert('Failed to start session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to continue session
  const handleContinueSession = () => {
    setCurrentSession(inProgressSession);
    setShowSessionPanel(true);
    setPopup(null);
  };

  // When ending a session, save session with title, transcript, and timestamp
  const handleEndSession = (sessionData) => {
    setShowSessionPanel(false);
    setCurrentSession(null);
    // Update localStorage and state immediately
    let sessions = getUserSessions(user);
    // Update the session in the list if needed (e.g., add summary, mark as completed)
    sessions = sessions.map(s => s.session_id === sessionData.sessionId ? { ...s, ...sessionData, completed: true } : s);
    setUserSessions(user, sessions);
    setAnalyticsSessions(sessions);
  };

  // Handle logout with animation
  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Add fade out animation
    await new Promise(resolve => setTimeout(resolve, 500));
    logout();
    navigate('/');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        updateProfilePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to handle mood check-in
  const handleMoodCheck = (moodLabel) => {
    if (!user?.email) return;
    setMood(moodLabel); // update context
    // Save to mood history (last 30 entries)
    const key = `moodHistory_${user.email}`;
    let moodArr = JSON.parse(localStorage.getItem(key) || '[]');
    moodArr.push({ value: moodLabel, timestamp: new Date().toISOString() });
    if (moodArr.length > 30) moodArr = moodArr.slice(moodArr.length - 30);
    localStorage.setItem(key, JSON.stringify(moodArr));
    setShowMoodCheck(false); // close modal
  };

  // Add new premium dashboard layout
  const renderPremiumDashboard = () => (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-start overflow-x-hidden z-10">
      <DashboardLiquidBG />
      {/* Hero Section */}
      <div className="w-full max-w-6xl mx-auto pt-12 pb-4 px-4 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        <div className="flex-1 flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <span className="text-5xl md:text-6xl animate-bounce-slow">{moodEmoji[mood] || '😊'}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary-700 mb-1">Good {getGreetingTime()}, {user?.name?.split(' ')[0] || 'there'}!</h1>
              <p className="text-neutral-500 text-lg">Here's your wellness snapshot for {today}.</p>
            </div>
          </div>
          <button className="btn-primary mt-2" onClick={()=>setShowMoodCheck(true)}>Check In Mood</button>
          <div className="mt-2 text-xs text-neutral-500 italic max-w-xs" style={{lineHeight:1.5}}>
            This prototype demonstrates our core vision — the complete product is in development and will deliver even greater impact.
          </div>
        </div>
        <div className="flex-1 flex flex-col items-end gap-2">
          <div className="bg-white/80 rounded-3xl shadow-xl px-8 py-6 flex flex-col items-center gap-2 glassmorphism-card">
            <span className="text-2xl font-bold text-primary-700">Streak: <span className="text-secondary-500">{getStreak()} days</span></span>
            <span className="text-neutral-500 text-sm">Keep it up! 🎉</span>
          </div>
        </div>
      </div>

      {/* Wellness Disclaimer */}
      <div className="w-full max-w-6xl mx-auto px-4 mb-6 z-10">
        <WellnessDisclaimer variant="default" />
      </div>
      {/* Main Cards Grid */}
      <div className="w-full max-w-6xl mx-auto px-4 z-10 my-8">
    
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Mood Progress Card */}
          <motion.div 
            className="liquid-card glassmorphism-card overflow-hidden break-words p-6 flex flex-col hover:shadow-2xl transition-all duration-300 h-[380px] min-h-[340px] max-h-[500px]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px'
            }}
          >
            <div className="w-full flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold text-primary-700 text-center w-full flex justify-center items-center gap-2">Mood Progress <Smile className="h-6 w-6 text-primary-400" /></h2>
            </div>
            <div className="flex-1 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-primary-100 scrollbar-track-primary-50 flex flex-col justify-between">
              <div>
                <MoodChart moodHistory={moodHistory} />
                <div className="mt-4 text-neutral-500 text-sm max-w-full break-words">Recent moods: {moodHistory.map((m, i) => <span key={i}>{m.value}{i < moodHistory.length-1 ? ', ' : ''}</span>)}</div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-base font-semibold text-primary-700">
                  <Smile className="h-5 w-5 text-yellow-400" />
                  Mood Streak: <span className="text-green-600 font-bold">{getStreak()} days</span>
                </div>
                <div className="flex items-center gap-2 text-base font-semibold text-primary-700">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Avg. Mood: <span className="text-blue-600 font-bold">{moodHistory.length ? Math.round(moodHistory.reduce((acc, m) => acc + (moodValueMap[m.value] || 70), 0) / moodHistory.length) : '--'}%</span>
                </div>
                <div className="mt-2 text-xs text-neutral-500 italic text-center">{getMotivationalQuote()}</div>
              </div>
            </div>
          </motion.div>
          {/* AI Insights Card */}
          <motion.div 
            className="liquid-card glassmorphism-card overflow-hidden break-words p-6 flex flex-col hover:shadow-2xl transition-all duration-300 h-[380px] min-h-[340px] max-h-[500px]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px'
            }}
          >
            <div className="w-full flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold text-secondary-700 text-center w-full flex justify-center items-center gap-2">AI Insights <Sparkles className="h-6 w-6 text-secondary-400 animate-bounce" /></h2>
            </div>
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-secondary-100 scrollbar-track-secondary-50 flex flex-col items-center justify-center p-4" style={{minHeight: 120, paddingTop: 0, paddingBottom: 0}}>
              {aiInsightLoading ? <div className="text-neutral-400 max-w-full w-full">Loading...</div> : aiInsightError ? <div className="text-red-500 max-w-full w-full">{aiInsightError}</div> :
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="glass-box rounded-[3rem] text-lg text-primary-700 font-semibold mb-2 whitespace-pre-line break-words w-full" style={{lineHeight: '1.7', padding: '0 0.5rem', marginTop: 0, marginBottom: 12, minHeight: 60}}>
                  {formatAIInsight(aiInsight)}
                </motion.div>
              }
              <div className="flex justify-center w-full mb-4">
                <button className="btn-secondary rounded-full py-4 px-10 mx-8" style={{margin: '0 auto', outline: 'none', border: 'none'}} onClick={()=>setPopup('Analytics')}>
                  View Full Analytics
                </button>
              </div>
            </div>
          </motion.div>
          {/* Session Timeline Card */}
          <motion.div 
            className="liquid-card glassmorphism-card overflow-hidden break-words p-6 flex flex-col hover:shadow-2xl transition-all duration-300 h-[380px] min-h-[340px] max-h-[500px]"
            style={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '24px'
            }}
          >
            <div className="w-full flex justify-center items-center mb-4">
              <h2 className="text-xl font-bold text-primary-700 text-center w-full flex justify-center items-center gap-2">Session Timeline <MessageCircle className="h-6 w-6 text-primary-400" /></h2>
            </div>
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar-inside rounded-2xl p-4" style={{background: 'rgba(255,255,255,0.96)'}}>
              <SessionTimeline sessions={sessionHistory} />
            </div>
            <button className="btn-primary mt-auto max-w-full w-full" onClick={()=>setPopup('Sessions')}>Start New Session</button>
          </motion.div>
                </div>
      </div>
      {/* Analytics Preview & Wellness Carousel */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 mt-12 mb-8 z-10">
        <motion.div 
          className="liquid-card glassmorphism-card overflow-hidden break-words p-8 flex flex-col hover:shadow-2xl transition-all duration-300" 
          style={{ 
            minHeight: '320px',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <div className="w-full flex justify-center items-center mb-4">
            <h2 className="text-lg font-bold text-primary-700 text-center w-full flex justify-center items-center gap-2">Analytics Preview <BarChart2 className="h-5 w-5 text-primary-400" /></h2>
          </div>
          <MiniAnalytics />
        </motion.div>
        <motion.div 
          className="liquid-card glassmorphism-card overflow-hidden break-words p-8 flex flex-col hover:shadow-2xl transition-all duration-300" 
          style={{ 
            minHeight: '320px',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '24px'
          }}
        >
          <div className="w-full flex justify-center items-center mb-4">
            <h2 className="text-lg font-bold text-secondary-700 text-center w-full flex justify-center items-center gap-2">Wellness Carousel <TrendingUp className="h-5 w-5 text-secondary-400" /></h2>
          </div>
          <WellnessCarousel cards={getWellnessCards()} />
        </motion.div>
      </div>
      {/* Footer/Support */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 mt-8 z-10">
        <div className="text-neutral-400 text-sm">Your data is private and secure. <span className="underline cursor-pointer" onClick={()=>setShowPrivacyModal(true)}>Privacy Settings</span></div>
        <button className="btn-secondary" onClick={()=>setShowSupportChat(true)}>Need help? Chat with support</button>
      </div>
    </div>
  );

  // Helper functions for greeting, streak, insights, etc.
  function getGreetingTime() {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }
  function getStreak() {
    // Calculate streak from moodHistory (consecutive days with mood check-in)
    if (!moodHistory || moodHistory.length === 0) return 0;
    // Sort by timestamp descending
    const sorted = [...moodHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    let streak = 1;
    let prev = new Date(sorted[0].timestamp);
    for (let i = 1; i < sorted.length; i++) {
      const curr = new Date(sorted[i].timestamp);
      const diff = (prev - curr) / (1000 * 60 * 60 * 24);
      if (diff <= 1.5 && diff >= 0.5) {
        streak++;
        prev = curr;
      } else {
        break;
      }
    }
    // If last check-in is not today, streak is 0
    const today = new Date();
    const last = new Date(sorted[0].timestamp);
    if (today.toDateString() !== last.toDateString()) return 0;
    return streak;
  }
  function getAIInsight() {
    // Example: return a smart insight or fetch from backend
    return 'Your mood improved 12% this week!';
  }
  function getMotivationalQuote() {
    // Example: rotate quotes
    return tips[Math.floor(Math.random() * tips.length)];
  }
  function getWellnessCards() {
    // Example: return carousel cards
    return [
      { title: "Today's Mindfulness Prompt", content: 'Take 3 deep breaths and notice your body.' },
      { title: 'Weekly Challenge', content: 'Complete 3 sessions this week.' },
      { title: 'Export My Data', content: 'Download your wellness data anytime.' },
      { title: 'Invite a Friend', content: 'Share HealMind AI and earn rewards!' },
    ];
  }

  // Placeholder components for chart, timeline, analytics, carousel
  const MoodChart = ({ moodHistory }) => (
    <div className="w-full h-24 flex items-end gap-2">
      {moodHistory.map((m, i) => (
        <div key={i} className={`flex-1 rounded-xl ${m.value === 'Great' ? 'bg-green-400' : m.value === 'Good' ? 'bg-blue-400' : m.value === 'Okay' ? 'bg-yellow-400' : m.value === 'Stressed' ? 'bg-orange-400' : 'bg-red-400'}`} style={{ height: `${(moodValueMap[m.value] || 70)}%`, minHeight: 12 }} />
              ))}
            </div>
  );
  const SessionTimeline = ({ sessions }) => (
    <div className="w-full flex flex-col gap-4">
      {sessions && sessions.length > 0 ? sessions.map((s, i) => {
        let sessionType = 'Session';
        if (typeof s.therapy === 'string') {
          sessionType = s.therapy;
        } else if (s.therapy && typeof s.therapy === 'object') {
          sessionType = s.therapy.name || s.therapy.title || 'Session';
        } else if (s.therapyName) {
          sessionType = s.therapyName;
        } else if (s.title) {
          sessionType = s.title;
        }
        return (
          <div key={s.session_id || i} className="flex items-center justify-between gap-2 bg-white/70 rounded-xl px-4 py-2 shadow-sm border border-neutral-100">
            <div className="flex flex-col">
              <span className="font-bold text-primary-700 text-base">
                {sessionType}
              </span>
              <span className="text-xs text-neutral-400">{s.created_at ? new Date(s.created_at).toLocaleString() : ''}</span>
              {s.summary && <span className="text-xs text-neutral-500 italic mt-1">{s.summary.slice(0, 48)}{s.summary.length > 48 ? '...' : ''}</span>}
          </div>
        </div>
        );
      }) : <div className="text-neutral-400 text-center">No sessions yet.</div>}
      </div>
  );
  const MiniAnalytics = () => (
    <div className="w-full flex flex-col gap-2">
      {analyticsLoading ? <div className="text-neutral-400">Loading...</div> : analyticsError ? <div className="text-red-500">{analyticsError}</div> : (
        <>
          <motion.div className="flex items-center justify-between w-full bg-white/70 rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all">
            <span className="text-neutral-600 font-medium">Sessions this month</span>
            <span className="text-primary-700 font-bold">{analytics?.sessionCount || 0}</span>
          </motion.div>
          <motion.div className="flex items-center justify-between w-full bg-white/70 rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all">
            <span className="text-neutral-600 font-medium">Avg. session</span>
            <span className="text-primary-700 font-bold">{analytics?.avgSession || 0} min</span>
          </motion.div>
          <motion.div className="flex items-center justify-between w-full bg-white/70 rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all">
            <span className="text-neutral-600 font-medium">Most used therapy</span>
            <span className="text-primary-700 font-bold">{analytics?.mostUsedTherapy && analytics.mostUsedTherapy !== 'Session' ? analytics.mostUsedTherapy : 'Will be updated soon...'}</span>
          </motion.div>
        </>
      )}
    </div>
  );
  const WellnessCarousel = ({ cards }) => (
    <div className="w-full flex gap-4 overflow-x-auto py-2">
      {cards.map((card, i) => (
        <div key={i} className="min-w-[220px] bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-4 shadow-md flex flex-col items-start gap-2">
          <div className="font-bold text-primary-700">{card.title}</div>
          <div className="text-neutral-600 text-sm">{card.content}</div>
          </div>
      ))}
    </div>
  );

  // Enhanced Mood Check-In modal with AnimatePresence and smooth exit
  const renderMoodCheck = () => (
    <AnimatePresence>
      {showMoodCheck && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 animate-gradient-bg"
            style={{background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', filter: 'blur(2px)', zIndex: 0}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="absolute inset-0 bg-black/30 transition-opacity duration-300 z-10"
            onClick={()=>setShowMoodCheck(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="relative z-20 rounded-3xl shadow-2xl max-w-md w-full px-6 py-10 animate-scale-in flex flex-col items-center gap-6"
            style={{backdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.65)', boxShadow: '0 8px 32px 0 rgba(80,120,255,0.10)'}}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <button className="absolute top-4 right-4 text-neutral-400 hover:text-primary-500 transition-colors" onClick={()=>setShowMoodCheck(false)} aria-label="Close"><X className="h-6 w-6" /></button>
            <h2 className="text-3xl font-bold text-primary-700 mb-2 animate-fade-in">How are you feeling?</h2>
            <div className="w-full flex flex-wrap justify-center gap-4 mb-2 animate-float">
              {moodOptions.map((m, i) => (
                <button
                  key={m.label}
                  className={`flex flex-col items-center gap-1 px-6 py-4 rounded-2xl border-2 border-transparent transition-all duration-200 text-3xl font-bold ${m.color} hover:scale-105 hover:shadow-2xl hover:border-primary-300 focus:scale-110 focus:shadow-2xl ${m.glow} shadow-lg bg-opacity-80`}
                  style={{animationDelay: `${i * 0.05}s`, minWidth: 90, boxShadow: '0 4px 24px 0 rgba(80,120,255,0.10)'}}
                  onClick={()=>{
                    // Save mood to history
                    const moodArr = JSON.parse(localStorage.getItem('moodHistory') || '[]');
                    moodArr.push(m.label);
                    localStorage.setItem('moodHistory', JSON.stringify(moodArr));
                    handleMoodCheck(m.label);
                  }}
                >
                  <span className="animate-bounce-slow" style={{filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.10))'}}>{m.icon}</span>
                  <span className="text-xs text-neutral-700 font-semibold mt-1">{m.label}</span>
                </button>
              ))}
            </div>
            <p className="text-neutral-500 text-sm max-w-md text-center animate-fade-in">Your mood helps us personalize your experience and track your progress.</p>
          </motion.div>
          <style>{`
            .animate-gradient-bg {
              animation: gradientMove 8s ease-in-out infinite alternate;
            }
            @keyframes gradientMove {
              0% { background-position: 0% 50%; }
              100% { background-position: 100% 50%; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Session summary modal
  const renderSummaryModal = () => viewSummary && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={()=>setViewSummary(null)} />
      <div className="relative z-50 bg-white/95 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-scale-in flex flex-col gap-4">
        <button className="absolute top-4 right-4 text-neutral-400 hover:text-primary-500 transition-colors" onClick={()=>setViewSummary(null)} aria-label="Close"><X className="h-6 w-6" /></button>
        <h2 className="text-2xl font-bold text-primary-700 mb-2">Session Summary</h2>
        <div className="font-semibold text-primary-700">{viewSummary.therapy}</div>
        <div className="text-xs text-neutral-500 mb-2">{viewSummary.date}</div>
        <div className="text-neutral-700 text-sm mb-2">{viewSummary.summary}</div>
        <div className="text-xs text-primary-500">Copilot: "Great progress! Keep practicing."</div>
      </div>
    </div>
  );

  // Glossy popup modal
  const renderPopup = () => {
    if (!popup || popup === 'Sessions') return null;
    
    if (popup === 'Profile') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-2xl w-full p-0 relative animate-scale-in flex flex-col"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Back Button */}
            <motion.button
              className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 font-semibold shadow hover:shadow-lg hover:bg-primary-200 transition-all z-10"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>setPopup(null)}
              aria-label="Back to Dashboard"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back
            </motion.button>
            <div className="p-8 pt-20 pb-12 md:pt-24 md:pb-16 flex flex-col flex-1 justify-center rounded-3xl" style={{minHeight:'540px'}}>
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="relative group w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0) || 'U'
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    title="Change profile photo"
                  >
                    <Upload className="w-8 h-8 text-white" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <h2 className="text-3xl font-bold text-primary-700 mb-2">{user?.name || 'User'}</h2>
                <p className="text-neutral-600">{user?.email}</p>
                <motion.div 
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mt-3 ${
                    user?.isPro 
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg' 
                      : 'bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700'
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {user?.isPro ? '⭐ Pro Member' : '🔒 Free Plan'}
                </motion.div>
              </div>

              {/* Current Plan Details */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 mb-6 border border-primary-100">
                <h3 className="text-xl font-bold text-primary-700 mb-4">Current Plan</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Plan Type:</span>
                    <span className="font-semibold text-primary-700">{user?.isPro ? 'Pro' : 'Free'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">AI Sessions:</span>
                    <span className="font-semibold text-primary-700">{user?.isPro ? 'Unlimited' : '5/month'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Voice Therapy:</span>
                    <span className="font-semibold text-primary-700">{user?.isPro ? '✅ Available' : '❌ Not Available'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Analytics:</span>
                    <span className="font-semibold text-primary-700">{user?.isPro ? '✅ Advanced' : '❌ Basic'}</span>
                  </div>
                </div>
              </div>

              {/* Plan Actions */}
              <div className="space-y-4">
                {user?.isPro ? (
                  <a
                    href={
                      "mailto:contact@neuralyn.health?subject=Downgrade%20Request%20for%20HealMind%20AI&body=Hi%20Neuralyn%20team%2C%20I%20would%20like%20to%20downgrade%20my%20HealMind%20AI%20account%20to%20the%20Free%20Plan.%20Please%20assist.%20My%20email%3A%20" + encodeURIComponent(user?.email || '')
                    }
                    className="w-full block text-center bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700 px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ display: 'block' }}
                  >
                    Downgrade to Free Plan
                  </a>
                ) : (
                  <motion.button
                    onClick={() => {
                      // Upgrade to pro
                      const updatedUser = { ...user, isPro: true };
                      localStorage.setItem('user', JSON.stringify(updatedUser));
                      window.location.reload();
                    }}
                    className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⭐ Upgrade to Pro - $29/month
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      );
    } else if (popup === 'Analytics') {
      // Mood Progress: moodHistory (last 7 days)
      const moodProgress = moodHistory.map((m, i) => ({
        day: i + 1,
        date: m.timestamp ? new Date(m.timestamp).toLocaleDateString() : '',
        mood: moodValueMap[m.value] || 70,
        label: m.value
      }));
      // Therapy Preferences: count by therapy type from analyticsSessions
      const therapyCounts = {};
      analyticsSessions.forEach(s => {
        const t = typeof s.therapy === 'string' ? s.therapy : (s.therapy?.name || s.therapy?.title || 'Session');
        therapyCounts[t] = (therapyCounts[t] || 0) + 1;
      });
      const totalTherapies = Object.values(therapyCounts).reduce((a, b) => a + b, 0) || 1;
      const therapyUsageData = Object.entries(therapyCounts).map(([name, count], i) => ({
        name,
        usage: Math.round((count / totalTherapies) * 100),
        color: ['bg-blue-400','bg-purple-400','bg-green-400','bg-yellow-400','bg-pink-400'][i % 5]
      }));
      // Session Frequency
      const now = new Date();
      const sessionsThisMonth = analyticsSessions.filter(s => {
        const d = new Date(s.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const sessionsThisWeek = analyticsSessions.filter(s => {
        const d = new Date(s.created_at);
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return d >= startOfWeek && d <= now;
      });
      const sessionsLastWeek = analyticsSessions.filter(s => {
        const d = new Date(s.created_at);
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
        return d >= startOfLastWeek && d < startOfThisWeek;
      });
      const avgSessionDuration = analyticsSessions.length > 0 ? Math.round(analyticsSessions.reduce((acc, s) => acc + (s.duration || 20), 0) / analyticsSessions.length) : 0;
      const completionRate = analyticsSessions.length > 0 ? Math.round((analyticsSessions.filter(s => s.completed).length / analyticsSessions.length) * 100) + '%' : '0%';
      // Wellness Score
      const moodAvg = moodHistory.length ? Math.round(moodHistory.reduce((a, b) => a + (moodValueMap[b.value] || 70), 0) / moodHistory.length) : 70;
      const engagementScore = Math.min(100, (sessionsThisWeek.length * 20));
      const wellnessScore = Math.round((moodAvg * 0.6) + (engagementScore * 0.4));
      // Achievements (example: completed X sessions, streak, etc.)
      const wellnessAchievements = [
        `Completed ${sessionsThisWeek.length} sessions this week`,
        `Current streak: ${getStreak()} days`,
        `Mood avg: ${moodAvg}`
      ];
      // Goals & Milestones
      const weeklyGoal = 4;
      const goalsData = {
        weeklyCompleted: sessionsThisWeek.length,
        weeklyTarget: weeklyGoal,
        moodImprovement: moodProgress.length > 1 ? Math.max(0, moodProgress[moodProgress.length-1].mood - moodProgress[0].mood) : 0,
        nextMilestone: `${20 - analyticsSessions.length} sessions to advanced insights`
      };
      // For Therapy Preferences, list each session as Session 1, 2, ...
      const sessionList = analyticsSessions.slice(-5).reverse().map((s, i, arr) => ({
        label: `Session ${arr.length - i}`,
        date: s.created_at ? new Date(s.created_at).toLocaleDateString() : '',
        duration: s.duration || 20,
        summary: s.summary || ''
      }));
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-xl m-4 relative h-[90vh] overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ maxWidth: '100vw', boxSizing: 'border-box' }}
          >
            {/* Back Button */}
            <button 
              onClick={() => setPopup(null)}
              className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary-700 font-semibold shadow-sm hover:shadow-md transition-all z-10 border border-neutral-100"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <div className="h-full w-full overflow-y-auto custom-scrollbar p-8 pt-24 pb-8 md:pb-12">
              <h2 className="text-3xl font-bold text-center text-primary-700 mb-2">Your Mental Health Analytics</h2>
              <p className="text-center text-neutral-600 mb-8">AI-powered insights into your wellness journey</p>
              <div className="mb-4 p-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-medium text-center border border-blue-100 shadow-sm">
                This is a demo visualization page and will automatically update once your session is completed.
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-x-hidden">
                {/* Left Column */}
                <div className="space-y-6 col-span-1">
                  {/* Emotional Triggers & Patterns (real data) */}
                  <AnalyticsCard title="🧠 Emotional Triggers & Patterns">
                    <div className="flex flex-col gap-3 max-h-56 overflow-y-auto custom-scrollbar-inside rounded-2xl p-1" style={{background: 'rgba(255,255,255,0.85)'}}>
                      {extractEmotionalTriggers(analyticsSessions, moodHistory).length === 0 ? (
                        <div className="text-neutral-400">No triggers detected yet</div>
                      ) : extractEmotionalTriggers(analyticsSessions, moodHistory).map((t, i) => (
                        <div key={i} className="bg-white/80 rounded-xl p-3 flex flex-col shadow-sm border border-neutral-100">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-primary-700">{t.label}</span>
                            <span className={`font-bold ${t.impact.startsWith('-') ? 'text-red-500' : 'text-green-600'}`}>{t.impact}</span>
              </div>
                          <div className="text-xs text-neutral-500 mt-1">Coping: <span className="font-medium text-green-600">{t.strategy}</span></div>
                        </div>
                      ))}
                    </div>
                  </AnalyticsCard>
                  {/* Mood Progress (unchanged) */}
                  <div className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <BarChart2 className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-neutral-800">Mood Progress</h3>
                    </div>
                    <div className="space-y-4">
                      {moodProgress.map((day, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-16 pt-1">
                            <span className="text-sm font-medium text-neutral-600">Day {day.day}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-neutral-500">{day.date}</span>
                              <span className="text-sm font-medium text-blue-600">{day.mood}%</span>
                            </div>
                            <div className="w-full bg-blue-50 rounded-full h-2">
                <motion.div 
                                className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                                animate={{ width: `${day.mood}%` }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                          />
                        </div>
                          </div>
                      </div>
                    ))}
                  </div>
                      </div>
                  {/* (Removed Recent Sessions card) */}
                      </div>
                {/* Middle Column (Session Frequency & Wellness Score) - unchanged */}
                <div className="space-y-6 col-span-2">
                  {/* Session Frequency */}
                  <div className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Calendar className="h-6 w-6 text-purple-600" />
                      <h3 className="text-xl font-bold text-neutral-800">Session Frequency</h3>
                      </div>
                    <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                      <div className="text-5xl font-bold text-purple-600 mb-2">{sessionsThisMonth.length}</div>
                      <div className="text-sm text-neutral-600">Sessions this month</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 border border-neutral-100">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{sessionsThisWeek.length}</div>
                        <div className="text-sm text-neutral-500">This Week</div>
                  </div>
                      <div className="bg-white rounded-xl p-4 border border-neutral-100">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{sessionsLastWeek.length}</div>
                        <div className="text-sm text-neutral-500">Last Week</div>
                    </div>
                      <div className="bg-white rounded-xl p-4 border border-neutral-100">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{avgSessionDuration} min</div>
                        <div className="text-sm text-neutral-500">Avg Duration</div>
                    </div>
                      <div className="bg-white rounded-xl p-4 border border-neutral-100">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{completionRate}</div>
                        <div className="text-sm text-neutral-500">Completion Rate</div>
                    </div>
                  </div>
                        </div>
                  {/* Wellness Score */}
                  <div className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-green-100 rounded-full">
                        <span className="text-xl">✨</span>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-800">Wellness Score</h3>
                  </div>
                    <div className="text-center mb-6">
                    <motion.div 
                      className="text-6xl font-bold text-green-600 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        {wellnessScore}
                    </motion.div>
                      <div className="text-neutral-600">{wellnessScore > 80 ? 'Excellent Progress!' : wellnessScore > 60 ? 'Good Progress' : 'Keep Going!'}</div>
                      </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-sm font-medium text-green-700 mb-3">This Week's Achievements</div>
                      <div className="space-y-2">
                        {wellnessAchievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span>{achievement}</span>
                    </div>
                        ))}
                  </div>
                    </div>
                  </div>
                </div>
                {/* Right Column (Goals & Milestones + Visualization + Self-Help Activity Scoreboard) */}
                <div className="space-y-6 col-span-1">
                {/* Goals & Milestones */}
                  <div className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Target className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-neutral-800">Goals & Milestones</h3>
                    </div>
                    <div className="space-y-6">
                      {/* Weekly Sessions */}
                      <div>
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-neutral-700">Weekly Sessions</span>
                          <span className="text-sm font-medium text-purple-600">
                            {goalsData.weeklyCompleted}/{goalsData.weeklyTarget}
                          </span>
                      </div>
                        <div className="w-full bg-purple-100 rounded-full h-2 mb-1">
                        <motion.div 
                            className="h-full bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (goalsData.weeklyCompleted / goalsData.weeklyTarget) * 100)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                      {/* Mood Improvement */}
                      <div>
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-neutral-700">Mood Improvement</span>
                          <span className="text-sm font-medium text-purple-600">{goalsData.moodImprovement}%</span>
                      </div>
                        <div className="w-full bg-purple-100 rounded-full h-2 mb-1">
                        <motion.div 
                            className="h-full bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, goalsData.moodImprovement)}%` }}
                            transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                      {/* Next Milestone */}
                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="text-sm font-medium text-purple-700 mb-2">Next Milestone</div>
                        <div className="text-sm text-neutral-600">{Math.max(0, 20 - analyticsSessions.length)} sessions to advanced insights</div>
                    </div>
                  </div>
                  </div>
                  {/* Mood Trend Visualization */}
                  <div className="bg-white rounded-3xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                      <h3 className="text-xl font-bold text-neutral-800">Mood Trend</h3>
                    </div>
                    <div className="w-full h-32 flex items-end gap-2">
                      {/* Simple line chart using SVG */}
                      <svg width="100%" height="100" viewBox="0 0 200 100" preserveAspectRatio="none">
                        {moodProgress.length > 1 && (
                          <polyline
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="3"
                            points={moodProgress.map((m, i) => `${(i/(moodProgress.length-1))*200},${100-(m.mood)}`).join(' ')}
                          />
                        )}
                        {/* Dots */}
                        {moodProgress.map((m, i) => (
                          <circle key={i} cx={(i/(moodProgress.length-1))*200} cy={100-(m.mood)} r="4" fill="#a78bfa" />
                        ))}
                      </svg>
                    </div>
                    <div className="text-xs text-neutral-500 mt-2">Your mood over the last 7 check-ins</div>
                  </div>
                  {/* Self-Help Activity Scoreboard (real data) */}
                  <AnalyticsCard title="🏆 Self-Help Activity Scoreboard">
                    {(() => {
                      const { journaling, breathing, sleep } = extractActivityCounts(analyticsSessions);
                      return (
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2"><span className="text-lg">📝</span> <span className="font-medium">Journaling:</span> <span className="text-primary-700">{journaling} times this week</span></div>
                          <div className="flex items-center gap-2"><span className="text-lg">🌬️</span> <span className="font-medium">Breathing Exercise:</span> <span className="text-primary-700">{breathing} sessions</span></div>
                          <div className="flex items-center gap-2"><span className="text-lg">🛌</span> <span className="font-medium">Sleep Aid:</span> <span className="text-primary-700">{sleep} times</span></div>
                          <div className="flex items-center gap-2"><span className="text-lg">🎯</span> <span className="font-medium">Streak:</span> <span className="text-primary-700">{getStreak()} days</span></div>
                          <div className="flex items-center gap-2 mt-2 text-green-600 font-semibold"><svg className="h-5 w-5 inline-block mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>👏 Keep going! You're building powerful habits.</div>
                        </div>
                      );
                    })()}
                  </AnalyticsCard>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    } else if (popup === 'Settings') {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <motion.div 
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full p-0 relative animate-scale-in flex flex-col h-[90vh] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
              border: '1px solid rgba(255,255,255,0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              paddingTop: 40, // extra space for top icons
              paddingBottom: 32 // extra space for bottom
            }}
          >
            {/* Back Button */}
            <motion.button
              className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 font-semibold shadow hover:shadow-lg hover:bg-primary-200 transition-all z-10"
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={()=>setPopup(null)}
              aria-label="Back to Dashboard"
              style={{marginTop: 0, marginLeft: 0}}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              Back
            </motion.button>
            <div className="p-8 pt-24 pb-16 md:pt-28 md:pb-20 flex flex-col flex-1 justify-center rounded-3xl h-full overflow-y-auto">
              {/* Settings Header */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary-700 mb-2">Settings</h2>
                <p className="text-neutral-600">Customize your HealMind AI experience</p>
              </div>

              {/* Settings Sections */}
              <div className="space-y-6">
                {/* Appearance */}
                <motion.div 
                  className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-6 border border-primary-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-xl font-bold text-primary-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Appearance
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Theme</span>
                      <select className="px-4 py-2 rounded-xl border border-neutral-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400" value={theme} onChange={e => setTheme(e.target.value)}>
                        <option>Light</option>
                        <option>Dark</option>
                        <option>System</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Font Size</span>
                      <select className="px-4 py-2 rounded-xl border border-neutral-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-400" value={fontSize} onChange={e => setFontSize(e.target.value)}>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Animations</span>
                      <motion.button className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${animations ? 'bg-primary-500' : 'bg-neutral-300'}`} whileTap={{ scale: 0.9 }} onClick={() => setAnimations(a => !a)}>
                        <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200" animate={{ x: animations ? 24 : 0 }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div 
                  className="bg-gradient-to-r from-secondary-50 to-healing-50 rounded-2xl p-6 border border-secondary-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-secondary-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔔</span>
                    Notifications
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Session Reminders</span>
                      <motion.button className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notifications.session ? 'bg-secondary-500' : 'bg-neutral-300'}`} whileTap={{ scale: 0.9 }} onClick={() => setNotifications(n => ({ ...n, session: !n.session }))}>
                        <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200" animate={{ x: notifications.session ? 24 : 0 }} />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Mood Check-ins</span>
                      <motion.button className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notifications.mood ? 'bg-secondary-500' : 'bg-neutral-300'}`} whileTap={{ scale: 0.9 }} onClick={() => setNotifications(n => ({ ...n, mood: !n.mood }))}>
                        <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200" animate={{ x: notifications.mood ? 24 : 0 }} />
                      </motion.button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-700">Weekly Reports</span>
                      <motion.button className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${notifications.weekly ? 'bg-secondary-500' : 'bg-neutral-300'}`} whileTap={{ scale: 0.9 }} onClick={() => setNotifications(n => ({ ...n, weekly: !n.weekly }))}>
                        <motion.div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 transition-transform duration-200" animate={{ x: notifications.weekly ? 24 : 0 }} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {/* Data & Privacy */}
                <motion.div 
                  className="bg-gradient-to-r from-healing-50 to-primary-50 rounded-2xl p-6 border border-healing-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-bold text-healing-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    Data & Privacy
                  </h3>
                  <div className="space-y-4">
                    <motion.button className="w-full bg-gradient-to-r from-healing-500 to-primary-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={exportAnalyticsPDF}>
                      📥 Export My Data
                    </motion.button>
                    <motion.button className="w-full bg-gradient-to-r from-neutral-200 to-neutral-300 text-neutral-700 px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={async () => { if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) { await deleteAccount(user.email); logout(); navigate('/'); } }}>
                      🗑️ Delete Account
                    </motion.button>
                  </div>
                </motion.div>

                {/* Support */}
                <motion.div 
                  className="bg-gradient-to-r from-neutral-50 to-primary-50 rounded-2xl p-6 border border-neutral-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h3 className="text-xl font-bold text-neutral-700 mb-4 flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    Support
                  </h3>
                  <div className="space-y-4">
                    <motion.button className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300" whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }} onClick={() => window.location.href = 'mailto:contact@neuralyn.health'}>
                      📧 Contact Support
                    </motion.button>
                    <motion.button 
                      className="w-full bg-gradient-to-r from-secondary-500 to-healing-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={()=>setShowSupportChat(true)}
                    >
                      💬 Chat with Support
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }
    
    return null;
  };

  // --- USER-SPECIFIC DATA HELPERS ---
  function getUserSessions(user) {
    if (!user?.email) return [];
    return JSON.parse(localStorage.getItem(`sessions_${user.email}`) || '[]');
  }
  function setUserSessions(user, sessions) {
    if (!user?.email) return;
    localStorage.setItem(`sessions_${user.email}`, JSON.stringify(sessions));
  }
  function getUserCopilotSummaries(user) {
    if (!user?.email) return [];
    return JSON.parse(localStorage.getItem(`copilot_${user.email}`) || '[]');
  }
  function setUserCopilotSummaries(user, summaries) {
    if (!user?.email) return;
    localStorage.setItem(`copilot_${user.email}`, JSON.stringify(summaries));
  }
  function getUserAIInsight(user) {
    if (!user?.email) return '';
    return localStorage.getItem(`aiInsight_${user.email}`) || '';
  }
  function setUserAIInsight(user, insight) {
    if (!user?.email) return;
    localStorage.setItem(`aiInsight_${user.email}`, insight);
  }
  function getUserAnalytics(user) {
    if (!user?.email) return null;
    return JSON.parse(localStorage.getItem(`analytics_${user.email}`) || 'null');
  }
  function setUserAnalytics(user, analytics) {
    if (!user?.email) return;
    localStorage.setItem(`analytics_${user.email}`, JSON.stringify(analytics));
  }
  // --- FETCHERS (USER-SPECIFIC, FULLY REACTIVE) ---
  useEffect(() => {
    if (!user?.email) return;
    // Always reload sessions from user-specific storage
    let sessions = getUserSessions(user);
    setAnalyticsSessions(sessions);
  }, [user]);

  // Recalculate analytics preview, session frequency, goals, milestones on user or session change
  useEffect(() => {
    if (!user?.email) return;
    const sessions = getUserSessions(user);
    // Session Frequency calculations
    const now = new Date();
    const thisMonth = sessions.filter(s => {
      if (!s.created_at) return false;
      const d = new Date(s.created_at);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const thisWeek = sessions.filter(s => {
      if (!s.created_at) return false;
      const d = new Date(s.created_at);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return d >= startOfWeek && d <= now;
    });
    const lastWeek = sessions.filter(s => {
      if (!s.created_at) return false;
      const d = new Date(s.created_at);
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay());
      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
      return d >= startOfLastWeek && d < startOfThisWeek;
    });
    const avgSession = sessions.length ? Math.round(sessions.reduce((acc, s) => acc + (s.duration || 20), 0) / sessions.length) : 0;
    const completionRate = sessions.length ? Math.round((sessions.filter(s => s.completed).length / sessions.length) * 100) : 0;
    // Goals & Milestones
    const weeklyTarget = 4;
    const weeklyCompleted = thisWeek.length;
    const moodImprovement = 0; // Placeholder, can be calculated from moodHistory
    setAnalytics({
      sessionCount: thisMonth.length,
      avgSession,
      mostUsedTherapy: (() => {
        const counts = {};
        sessions.forEach(s => {
          const t = typeof s.therapy === 'string' ? s.therapy : (s.therapy?.name || s.therapy?.title || 'Session');
          counts[t] = (counts[t] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Session';
      })(),
      thisWeek: thisWeek.length,
      lastWeek: lastWeek.length,
      completionRate,
      weeklyTarget,
      weeklyCompleted,
      moodImprovement
    });
  }, [user, analyticsSessions]);

  // AI Insights: update whenever user or analyticsSessions change
  useEffect(() => {
    if (!user?.email) return;
    async function fetchAIInsight() {
      setAIInsightLoading(true);
      setAIInsightError(null);
      try {
        let sessions = getUserSessions(user);
        if (!sessions.length) {
          sessions = await chatApi.getAllSessions();
          sessions = sessions.filter(s => s.user === user.email);
          setUserSessions(user, sessions);
        }
        if (sessions.length > 0) {
          const summary = await chatApi.getCopilotSummary(sessions[0].session_id);
          setUserAIInsight(user, summary.summary || 'No insights yet.');
          setAIInsight(summary.summary || 'No insights yet.');
        } else {
          setUserAIInsight(user, 'No sessions yet. Start a session to get insights!');
          setAIInsight('No sessions yet. Start a session to get insights!');
        }
      } catch (err) {
        setAIInsightError('Failed to load AI insights');
      } finally {
        setAIInsightLoading(false);
      }
    }
    fetchAIInsight();
  }, [user, analyticsSessions]);

  // In AI Insights, post-process summary for beauty and clarity
  function formatAIInsight(text) {
    if (!text) return '';
    // Split by numbered insights or sentences
    let insights = text.split(/Insight \d+:/).filter(Boolean).map(s => s.trim());
    if (insights.length > 0) {
      // Limit to 2-3 insights, add line breaks and numbers
      insights = insights.slice(0, 3).map((s, i) => `Insight ${i+1}: ${s.replace(/^Insight \d+:/, '').trim()}`);
      return insights.join('\n\n').trim();
    }
    // Fallback: limit to 2-3 sentences
    let sentences = text.split(/(?<=[.!?])\s+/).slice(0, 3);
    return sentences.join(' ').trim();
  }

  // Ensure popup is reset on mount and user change
  useEffect(() => {
    setPopup(null);
  }, [user]);

  // Fetch sessions and AI insights for analytics
  useEffect(() => {
    async function fetchAnalyticsData() {
      setAnalyticsLoading(true);
      setAnalyticsError(null);
      try {
        const sessions = await chatApi.getAllSessions();
        // Only include sessions for the current user
        const filtered = user?.email ? sessions.filter(s => s.user === user.email || s.user_id === user.email) : sessions;
        setAnalyticsSessions(filtered);
      } catch (err) {
        setAnalyticsError('Failed to load analytics data.');
      } finally {
        setAnalyticsLoading(false);
      }
    }
    fetchAnalyticsData();
  }, [user]);

  useEffect(() => {
    async function fetchInsights() {
      setAiInsightsLoading(true);
      setAiInsightsError(null);
      try {
        if (analyticsSessions.length > 0) {
          const latestSession = analyticsSessions[0];
          const summary = await chatApi.getCopilotSummary(latestSession.session_id);
          setAiInsights(summary.summary || 'No insights yet.');
        } else {
          setAiInsights('No sessions yet. Start a session to get insights!');
        }
      } catch (err) {
        setAiInsightsError('Failed to load AI insights.');
      } finally {
        setAiInsightsLoading(false);
      }
    }
    if (analyticsSessions.length > 0) fetchInsights();
  }, [analyticsSessions]);

  // Helper: get mood history (last 7 days)
  const moodHistory = (() => {
    if (!user?.email) return [];
    const arr = JSON.parse(localStorage.getItem(`moodHistory_${user.email}`) || '[]');
    return arr.slice(-7);
  })();

  // Helper: Extract top emotional triggers from session summaries and copilot summaries
  function extractEmotionalTriggers(sessions, moodHistory) {
    // Define trigger keywords and coping strategies
    const triggers = [
      { key: 'work', label: 'Work Stress', strategy: 'Try a breathing exercise' },
      { key: 'relationship', label: 'Relationship Conflict', strategy: 'Practice mindful listening' },
      { key: 'sleep', label: 'Lack of Sleep', strategy: 'Wind down with a sleep story' },
      { key: 'anxiety', label: 'Anxiety', strategy: 'Ground yourself with 5-4-3-2-1' },
      { key: 'overwhelm', label: 'Feeling Overwhelmed', strategy: 'Break tasks into small steps' },
      { key: 'self-esteem', label: 'Low Self-Esteem', strategy: 'Write down 3 strengths' },
      { key: 'sad', label: 'Sadness', strategy: 'Reach out to a friend' },
      { key: 'anger', label: 'Anger', strategy: 'Pause and breathe deeply' },
    ];
    // Count trigger mentions in summaries
    const triggerCounts = {};
    const allSummaries = sessions.map(s => (s.summary || '').toLowerCase()).join(' ');
    triggers.forEach(t => {
      const count = (allSummaries.match(new RegExp(t.key, 'g')) || []).length;
      if (count > 0) triggerCounts[t.label] = { ...t, count };
    });
    // Sort by count and take top 3
    const topTriggers = Object.values(triggerCounts).sort((a, b) => b.count - a.count).slice(0, 3);
    // Estimate mood impact (difference in mood on days with trigger vs. avg mood)
    const avgMood = moodHistory.length ? moodHistory.reduce((a, b) => a + (moodValueMap[b.value] || 70), 0) / moodHistory.length : 70;
    topTriggers.forEach(t => {
      // Find days with trigger in summary
      const daysWithTrigger = sessions.filter(s => (s.summary || '').toLowerCase().includes(t.key));
      const moodOnDays = daysWithTrigger.map(s => {
        // Find mood entry closest to session date
        if (!s.created_at) return null;
        const sessionDate = new Date(s.created_at);
        let closest = null, minDiff = Infinity;
        for (const m of moodHistory) {
          if (!m.timestamp) continue;
          const diff = Math.abs(new Date(m.timestamp) - sessionDate);
          if (diff < minDiff) { minDiff = diff; closest = m; }
        }
        return closest ? moodValueMap[closest.value] : null;
      }).filter(Boolean);
      const impact = moodOnDays.length ? Math.round(((moodOnDays.reduce((a, b) => a + b, 0) / moodOnDays.length) - avgMood)) : 0;
      t.impact = (impact > 0 ? '+' : '') + impact + '%';
    });
    return topTriggers;
  }
  // Helper: Count self-help activities from session summaries/messages
  function extractActivityCounts(sessions) {
    // Only count for current week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const isThisWeek = d => {
      const date = new Date(d);
      return date >= startOfWeek && date <= now;
    };
    let journaling = 0, breathing = 0, sleep = 0;
    sessions.forEach(s => {
      if (!s.created_at) return;
      if (!isThisWeek(s.created_at)) return;
      const text = (s.summary || '').toLowerCase();
      if (text.includes('journal')) journaling++;
      if (text.includes('breath')) breathing++;
      if (text.includes('sleep')) sleep++;
    });
    return { journaling, breathing, sleep };
  }

  // Add deleteAccount helper (calls backend endpoint to delete all user data for this email)
  async function deleteAccount(email) {
    try {
      await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.REACT_APP_API_KEY },
        body: JSON.stringify({ email })
      });
      // Optionally clear localStorage
      localStorage.clear();
    } catch (e) {
      alert('Failed to delete account. Please contact support.');
    }
  }

  // Add PDF export helper
  function exportAnalyticsPDF() {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text('HealMind AI Analytics Report', 14, 20);
    doc.setFontSize(14);
    doc.text(`User: ${user?.name || ''} (${user?.email || ''})`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);
    doc.setFontSize(16);
    doc.text('Mood Progress', 14, 52);
    autoTable(doc, {
      startY: 56,
      head: [['Day', 'Date', 'Mood']],
      body: moodHistory.map((m, i) => [i+1, m.timestamp ? new Date(m.timestamp).toLocaleDateString() : '', m.value]),
    });
    doc.text('Session Analytics', 14, doc.lastAutoTable.finalY + 12);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 16,
      head: [['Session', 'Date', 'Therapy', 'Summary']],
      body: analyticsSessions.map((s, i) => [i+1, s.created_at ? new Date(s.created_at).toLocaleDateString() : '', typeof s.therapy === 'string' ? s.therapy : (s.therapy?.name || s.therapy?.title || 'Session'), (s.summary || '').slice(0, 40)]),
    });
    doc.save('healmind-analytics.pdf');
  }

  // In the ProDashboard component state:
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  // Ensure sessionHistory is always in sync with user and analyticsSessions
  useEffect(() => {
    if (!user?.email) return;
    setSessionHistory(getUserSessions(user));
  }, [user, analyticsSessions]);

  // Clear analytics and analyticsSessions when user logs out or changes to a user with no data
  useEffect(() => {
    if (!user?.email) {
      setAnalytics(null);
      setAnalyticsSessions([]);
    }
  }, [user]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Premium Header with Logout */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-neutral-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <motion.div 
                className="text-2xl font-bold text-primary-600 flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                HealMind AI
                {user?.isPro && (
                  <span className="ml-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce" style={{letterSpacing: '1px'}}>
                    PRO
                  </span>
                )}
              </motion.div>
            </div>
            <div className="flex items-center space-x-4">
              <UserAvatar user={user} size="md" />
              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content Layout: Sidebar + Main */}
      <div className="pt-16 flex w-full min-h-screen">
        {/* Sidebar: always visible on md+, toggle on mobile */}
        <AnimatePresence>
          {(!showSessionPanel || !currentSession) && (sidebarOpen || isDesktop) && (
            <motion.aside
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -60, opacity: 0 }}
              transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 80 }}
              className="w-64 md:w-24 bg-white/70 backdrop-blur-xl shadow-xl z-40 flex flex-col items-center py-10 px-4 border-r-0"
              style={{
                borderTopRightRadius: 32,
                borderBottomRightRadius: 32,
                boxShadow: '4px 0 24px 0 rgba(80,120,255,0.10), 2px 0 0 0 #e0e7ff',
                borderRight: '2px solid #e0e7ff !important',
                marginTop: 24,
                height: '88vh', // fixed height
                minHeight: 520,
                maxHeight: '92vh',
                alignSelf: 'flex-start',
                position: 'sticky',
                top: 32,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,0.85) 100%)',
                overflow: 'hidden',
              }}
            >
              {/* Close button for mobile */}
              {!isDesktop && (
                <div className="md:hidden w-full flex justify-end mb-6">
                  <motion.button
                    whileTap={{ scale: 0.85, rotate: 90 }}
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 shadow"
                  >
                    <X className="h-6 w-6 text-primary-500" />
                  </motion.button>
                </div>
              )}
              <div className="mb-10 mt-12 cursor-pointer">
                <span style={{fontSize: 40, transition: 'all 0.5s'}}>
                  {/* Show mood emoji if set, else smile, animate to happy during session */}
                  {showSessionPanel && currentSession ? moodEmoji['Happy'] : (mood ? moodEmoji[mood] : <Smile className="h-10 w-10 text-primary-500" />)}
                </span>
              </div>
              {sidebarItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="mb-8 flex flex-col items-center cursor-pointer group"
                  tabIndex={0}
                  aria-label={item.label}
                  onClick={() => handleSidebarItemClick(item.label)}
                >
                  <motion.div
                    className="p-3 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 group-hover:from-primary-200 group-hover:to-secondary-200 transition-all shadow"
                  >
                    {item.icon}
                  </motion.div>
                  <span className="text-xs text-neutral-500 mt-2 font-semibold group-hover:text-primary-600 transition-colors">
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </motion.aside>
          )}
        </AnimatePresence>
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center justify-start py-6 px-2 sm:px-4 md:px-16 relative z-0 w-full" style={{ borderTopLeftRadius: 32 }}>
          {/* Only one of these three is ever rendered at a time: */}
          {showSessionPanel && currentSession ? (
            <SessionPanel
              open={showSessionPanel}
              onClose={handleEndSession}
              therapy={currentSession.therapy}
              sessionId={currentSession.sessionId}
              onCopilotUpdate={setCopilotSummary}
            />
          ) : popup === 'Sessions' ? (
            <>
              <TherapySelectionModal
                open={true}
                onClose={()=>setPopup(null)}
                onSelect={async (therapy) => {
                  setLoading(true);
                  await handleStartSession(therapy);
                  setLoading(false);
                  setPopup(null);
                }}
                proMode={true}
              />
              {loading && <MorphingBlobLoader />}
            </>
          ) : (
            renderPremiumDashboard()
          )}
          {/* Mood check-in modal (can be shown on top of welcome) */}
          {renderMoodCheck()}
          {renderSummaryModal()}
        </div>
        {renderPopup()}
      </div>
      {/* Mobile Sidebar Toggle (Hamburger) */}
      {!isDesktop && (
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 shadow-sm sticky top-0 z-20">
          <motion.button
            whileTap={{ scale: 0.85, rotate: 90 }}
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-gradient-to-br from-primary-100 to-secondary-100 shadow"
          >
            <Menu className="h-6 w-6 text-primary-500" />
          </motion.button>
          <span className="text-lg font-bold text-primary-700">HealMind AI Pro</span>
          <div className="w-8" />
        </div>
      )}
      <PrivacyModal open={showPrivacyModal} onClose={()=>setShowPrivacyModal(false)} user={user} analytics={analytics} onExport={exportAnalyticsPDF} onDelete={async()=>{if(window.confirm('Are you sure?')){await deleteAccount(user.email);logout();navigate('/');}}} />
      <SupportChatModal open={showSupportChat} onClose={()=>setShowSupportChat(false)} user={user} />
      <ComingSoonToast show={showComingSoon} onClose={()=>setShowComingSoon(false)} />
    </motion.div>
  );
};

export default ProDashboard; 