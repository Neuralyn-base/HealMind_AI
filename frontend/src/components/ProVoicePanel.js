import React, { useState, useRef, useEffect } from 'react';
import { Mic, Volume2, Loader2, Sparkles, Volume } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VoiceSettings from './VoiceSettings';

const ProVoicePanel = ({ open, onClose, therapy, sessionId, onVoiceTurn, onCopilotUpdate }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);
  const [voiceSettings, setVoiceSettings] = useState({ language: 'en', voiceGender: 'female', style: 'calm' });
  const [showSettings, setShowSettings] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Silence detection
  const startSilenceDetection = (stream) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    analyserRef.current = audioContextRef.current.createAnalyser();
    sourceRef.current.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    let silenceStart = null;
    let isSilent = false;
    function checkSilence() {
      analyserRef.current.getByteTimeDomainData(dataArray);
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      if (rms < 0.01) {
        if (!silenceStart) silenceStart = Date.now();
        if (Date.now() - silenceStart > 3500) {
          isSilent = true;
          stopListening();
          return;
        }
      } else {
        silenceStart = null;
      }
      if (!isSilent && isListening) requestAnimationFrame(checkSilence);
    }
    checkSilence();
  };

  // Start browser recording
  const startListening = async () => {
    // If AI is speaking, stop playback and reset
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsSpeaking(false);
    }
    setIsListening(true);
    setUserTranscript('');
    audioChunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new window.MediaRecorder(stream);
      isRecordingRef.current = true;
      mediaRecorder.current.ondataavailable = (e) => {
        audioChunks.current.push(e.data);
      };
      mediaRecorder.current.onstop = async () => {
        isRecordingRef.current = false;
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (sourceRef.current) sourceRef.current.disconnect();
        if (analyserRef.current) analyserRef.current.disconnect();
        setIsListening(false);
        setLoading(true);
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
      };
      mediaRecorder.current.start();
      // Interrupt-to-talk: If AI is speaking, stop playback and listen
      if (isSpeaking && audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        setIsSpeaking(false);
      }
      startSilenceDetection(stream);
      // Listen for mic input while AI is speaking
      if (isSpeaking) {
        // If user starts talking, stop AI and start listening
        setIsSpeaking(false);
      }
    } catch (err) {
      setIsListening(false);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  // Stop browser recording
  const stopListening = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      isRecordingRef.current = false;
    }
  };

  // Send audio to backend, play AI reply, update conversation
  const processAudio = async (audioBlob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('settings', JSON.stringify(voiceSettings));
      if (sessionId) formData.append('session_id', sessionId);
      
      // Build context from conversation history
      const context = conversation.map(turn => [
        { role: 'user', content: turn.user },
        { role: 'assistant', content: turn.ai }
      ]).flat();
      
      formData.append('context', JSON.stringify(context));
      
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to process audio');
      const data = await response.json();
      const { audio, transcribed_text, ai_response } = data;
      setUserTranscript(transcribed_text);
      setAiReply(ai_response);
      setConversation(prev => [...prev, { user: transcribed_text, ai: ai_response }]);
      
      // Only update Copilot, do not add to main chat
      if (onCopilotUpdate) onCopilotUpdate();
      
      // Play TTS audio
      if (audio) {
        const audioBytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
        const audioBlobResp = new Blob([audioBytes], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlobResp);
        const audioElement = new Audio(audioUrl);
        audioRef.current = audioElement;
        setIsSpeaking(true);
        
        // Add cleanup for audio element
        const cleanup = () => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            setIsSpeaking(false);
          }
        };
        
        // Clean up on close
        const handleClose = () => {
          cleanup();
          onClose();
        };
        
        audioElement.onended = () => {
          cleanup();
          // Handsfree: after AI finishes, start listening again
          setTimeout(() => startListening(), 400);
        };
        
        audioElement.play();
      } else {
        // If no audio, still handsfree
        setTimeout(() => startListening(), 400);
      }
    } catch (err) {
      alert('Failed to process audio. Please try again.');
    } finally {
      setLoading(false);
      setIsListening(false);
    }
  };

  // Animated waveform for user
  const UserWaveform = () => (
    <motion.div className="flex gap-1 items-end h-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-gradient-to-t from-blue-400 to-purple-400"
          animate={{ height: isListening ? [8, 32, 12, 24, 8][i % 5] : 8 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'mirror', delay: i * 0.07 }}
        />
      ))}
    </motion.div>
  );

  // Animated sound waves for AI
  const AIWaves = () => (
    <motion.div className="flex gap-2 items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="rounded-full bg-gradient-to-br from-green-300 to-teal-400"
          style={{ width: 16 + i * 8, height: 16 + i * 8, opacity: 0.18 - i * 0.04 }}
          animate={{ scale: isSpeaking ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: 'mirror', delay: i * 0.2 }}
        />
      ))}
    </motion.div>
  );

  // Cleanup on unmount or when panel closes
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsSpeaking(false);
    };
  }, []);

  // Stop audio when panel closes
  useEffect(() => {
    if (!open) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      setIsSpeaking(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background: 'rgba(0,0,0,0.18)'}}>
      {/* Glassy, animated card */}
      <motion.div
        className="relative bg-white/80 rounded-3xl shadow-2xl max-w-xl w-full p-10 flex flex-col items-center gap-8 animate-scale-in"
        style={{backdropFilter: 'blur(24px)', boxShadow: '0 8px 32px 0 rgba(80,120,255,0.10)'}}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <button className="absolute top-4 right-4 text-neutral-400 hover:text-primary-500 transition-colors" onClick={onClose} aria-label="Close"><Sparkles className="h-6 w-6" /></button>
        <div className="flex flex-col items-center gap-2">
          <div className="p-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg animate-float">
            <Mic className="h-8 w-8 text-white" />
          </div>
          <div className="font-bold text-xl text-primary-700">Premium Voice Session</div>
          <div className="text-neutral-500 text-sm">{therapy?.name || 'AI Therapy'} Voice</div>
        </div>
        {/* Conversation area with scrollable, rounded, premium AI reply */}
        <div className="w-full flex flex-col gap-y-4 max-h-72 overflow-y-auto rounded-2xl p-2 bg-white/60 shadow-inner">
          {conversation.map((turn, i) => (
            <div key={i} className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-blue-400 to-purple-400 p-2 shadow">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <div className="bg-blue-50 rounded-xl px-4 py-2 text-blue-900 font-medium shadow-inner max-w-[80vw] break-words border border-blue-100">
                  {turn.user}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <div className={`rounded-full p-2 shadow ${isSpeaking && i === conversation.length-1 ? 'bg-green-400 animate-pulse ring-2 ring-green-300' : 'bg-gradient-to-br from-green-300 to-teal-400'}`}> 
                  {isSpeaking && i === conversation.length-1 ? <Volume className="h-5 w-5 text-white animate-pulse" /> : <Volume2 className="h-5 w-5 text-white" />}
                </div>
                <div className={`bg-green-50 rounded-xl px-4 py-2 text-green-900 font-medium shadow-inner max-w-[80vw] break-words border border-green-100 ${isSpeaking && i === conversation.length-1 ? 'ring-2 ring-green-300 animate-glow' : ''}`} style={{maxHeight: 220, overflowY: 'auto'}}>
                  {turn.ai}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Animated state area */}
        <div className="flex flex-col items-center gap-4 w-full">
          <AnimatePresence>
            {isListening && (
              <motion.div key="userwave" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <UserWaveform />
                <div className="text-blue-700 font-semibold mt-2 animate-pulse">Listening...</div>
              </motion.div>
            )}
            {loading && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
                <div className="text-primary-700 font-semibold mt-2">Processing...</div>
              </motion.div>
            )}
            {isSpeaking && (
              <motion.div key="aiwave" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AIWaves />
                <div className="text-green-700 font-semibold mt-2 animate-pulse">AI is speaking...</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Controls */}
        <div className="flex gap-6 mt-4">
          {!isListening && !loading && !isSpeaking && (
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all text-lg" onClick={startListening}>
              <Mic className="inline-block mr-2" /> Start Talking
            </button>
          )}
          {isListening && (
            <button className="bg-gradient-to-r from-green-400 to-teal-400 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition-all text-lg animate-pulse" onClick={stopListening}>
              <Volume2 className="inline-block mr-2" /> Stop & Send
            </button>
          )}
        </div>
        {/* Settings Icon */}
        <button className="absolute left-4 bottom-4 p-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg animate-pulse" style={{zIndex: 20}} onClick={()=>setShowSettings(v=>!v)}>
          <Sparkles className="h-6 w-6 text-white" />
        </button>
        {showSettings && (
          <div className="absolute left-4 bottom-16 z-30">
            <VoiceSettings onSettingsChange={setVoiceSettings} initialSettings={voiceSettings} />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProVoicePanel;

<style>{`
  @keyframes glow { 0% { box-shadow: 0 0 8px 2px #6ee7b7; } 100% { box-shadow: 0 0 24px 6px #6ee7b7; } }
  .animate-glow { animation: glow 1.2s ease-in-out infinite alternate; }
`}</style> 