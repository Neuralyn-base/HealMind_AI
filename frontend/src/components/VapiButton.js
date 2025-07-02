import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi("de756a08-9d70-4185-b890-5f5b54f7b5bc");

function AnimatedWave({ listening }) {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" style={{
      position: 'absolute', left: 0, top: 0, zIndex: 0, pointerEvents: 'none'
    }}>
      <circle
        cx="40" cy="40" r="32"
        fill="none"
        stroke={listening ? "url(#waveGradient)" : "#a78bfa"}
        strokeWidth={listening ? 6 : 3}
        style={{
          filter: listening ? "drop-shadow(0 0 16px #a78bfa88)" : "none",
          opacity: listening ? 0.8 : 0.5,
          transition: 'all 0.3s'
        }}
      >
        <animate attributeName="r" values="32;36;32" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <defs>
        <linearGradient id="waveGradient" x1="0" y1="0" x2="80" y2="80">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function VapiButton() {
  const [voiceON, setVoiceON] = useState(false);

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

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '24px 0'
    }}>
      <button
        onClick={handleVoiceToggle}
        className="voice-portal-btn"
        style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.18)',
          border: 'none',
          boxShadow: voiceON
            ? '0 0 32px 0 #a78bfa88, 0 4px 32px 0 #22d3ee44'
            : '0 2px 12px 0 #fbbf2444',
          position: 'relative',
          overflow: 'visible',
          cursor: 'pointer',
          transition: 'box-shadow 0.2s, background 0.2s'
        }}
      >
        <AnimatedWave listening={voiceON} />
        <span style={{
          position: 'absolute', left: 0, top: 0, width: 80, height: 80,
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1
        }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
            style={{
              filter: voiceON ? 'drop-shadow(0 0 8px #a78bfa)' : 'none',
              transition: 'filter 0.2s'
            }}>
            <rect x="8" y="5" width="8" height="10" rx="4" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </span>
        <span className="voice-portal-pulse" style={{
          position: 'absolute', left: 0, top: 0, width: 80, height: 80, zIndex: 0,
          borderRadius: '50%', pointerEvents: 'none'
        }} />
      </button>
      <div style={{
        marginTop: 12, fontWeight: 700, fontSize: '1.1rem',
        color: '#fff', textShadow: '0 2px 12px #a78bfa88'
      }}>
        {voiceON ? "Listening..." : "Start Emotional Therapy"}
      </div>
      <style>
        {`
        .voice-portal-btn:hover {
          background: rgba(255,255,255,0.28);
          box-shadow: 0 0 48px 0 #a78bfa99, 0 8px 40px 0 #22d3ee55;
        }
        .voice-portal-btn:active {
          background: rgba(255,255,255,0.12);
        }
        .voice-portal-pulse {
          animation: portalPulse 1.8s infinite;
          background: radial-gradient(circle, #a78bfa33 0%, transparent 70%);
        }
        @keyframes portalPulse {
          0% { opacity: 0.7; transform: scale(1);}
          50% { opacity: 0.2; transform: scale(1.18);}
          100% { opacity: 0.7; transform: scale(1);}
        }
        `}
      </style>
    </div>
  );
} 