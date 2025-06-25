import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Volume2, Loader2, Settings } from 'lucide-react';
import { chatApi } from '../services/api';
import VoiceSettings from './VoiceSettings';

const VoiceSessionPanel = ({ open, onClose, therapy, sessionId, onVoiceTurn }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [conversation, setConversation] = useState([]);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    language: 'en',
    voiceGender: 'female',
    style: 'calm'
  });
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const silenceTimeout = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const isRecordingRef = useRef(false);
  const audioRef = useRef(null);

  // Helper to detect silence and auto-stop
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
      // Calculate RMS (root mean square) to detect silence
      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const normalized = (dataArray[i] - 128) / 128;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      if (rms < 0.01) { // Silence threshold
        if (!silenceStart) silenceStart = Date.now();
        if (Date.now() - silenceStart > 3000) { // 3 seconds of silence
          isSilent = true;
          handleStopListening();
          return;
        }
      } else {
        silenceStart = null;
      }
      if (!isSilent) requestAnimationFrame(checkSilence);
    }
    checkSilence();
  };

  const handleStartListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          noiseSuppression: true,
          echoCancellation: true,
          sampleRate: 16000
        }
      });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      isRecordingRef.current = true;

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        isRecordingRef.current = false;
        // Clean up audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        if (sourceRef.current) sourceRef.current.disconnect();
        if (analyserRef.current) analyserRef.current.disconnect();
        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          await processAudio(audioBlob);
        }
      };

      mediaRecorder.current.start();
      setIsListening(true);
      startSilenceDetection(stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopListening = () => {
    if (
      mediaRecorder.current &&
      mediaRecorder.current.state === 'recording' &&
      isRecordingRef.current
    ) {
      mediaRecorder.current.stop();
      setIsListening(false);
      isRecordingRef.current = false;
    }
  };

  const processAudio = async (audioBlob) => {
    setIsSpeaking(true);
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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to process audio');
      }

      const data = await response.json();
      const { audio, transcribed_text, ai_response } = data;

      // Decode base64 audio
      const audioBytes = Uint8Array.from(atob(audio), c => c.charCodeAt(0));
      const audioBlobResp = new Blob([audioBytes], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlobResp);
      const audioElement = new Audio(audioUrl);
      audioRef.current = audioElement;

      // Update conversation
      setConversation(prev => [...prev, { 
        user: transcribed_text, 
        ai: ai_response 
      }]);

      // Notify parent dashboard
      if (onVoiceTurn) {
        onVoiceTurn({ transcribedText: transcribed_text, aiResponse: ai_response });
      }

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

      // Play the audio response
      audioElement.play();
      audioElement.onended = cleanup;

    } catch (error) {
      console.error('Error processing audio:', error);
      alert('Failed to process audio. Please try again.');
      setIsSpeaking(false);
    }
  };

  const handleVoiceSettingsChange = (newSettings) => {
    setVoiceSettings(newSettings);
  };

  // Cleanup on unmount
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-0 sm:p-8 relative animate-scale-in flex flex-col h-[80vh] min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
              <therapy.icon className="h-7 w-7" />
            </div>
            <div>
              <div className="font-bold text-xl text-primary-700">{therapy.title} (Voice Session)</div>
              <div className="text-neutral-500 text-sm">Continuous, soothing voice therapy</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="text-neutral-400 hover:text-primary-500 transition-colors p-2"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </button>
            <button 
              className="text-neutral-400 hover:text-primary-500 transition-colors p-2"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Voice Settings */}
        {showSettings && (
          <div className="p-4 border-b border-neutral-100">
            <VoiceSettings
              onSettingsChange={handleVoiceSettingsChange}
              initialSettings={voiceSettings}
            />
          </div>
        )}

        {/* Conversation Area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 bg-gradient-to-br from-neutral-50 to-primary-50">
          <div className="space-y-6">
            {conversation.map((turn, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-3 mb-2">
                  <Mic className="h-5 w-5 text-primary-400" />
                  <div className="bg-primary-100 text-primary-800 rounded-2xl px-4 py-2 max-w-[70%]">{turn.user}</div>
                </div>
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-secondary-400" />
                  <div className="bg-secondary-100 text-secondary-900 rounded-2xl px-4 py-2 max-w-[70%]">{turn.ai}</div>
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex items-center gap-3 mt-4 animate-pulse">
                <Mic className="h-5 w-5 text-primary-400" />
                <div className="bg-primary-50 text-primary-700 rounded-2xl px-4 py-2 max-w-[70%] border border-primary-200">Listening... {userTranscript}</div>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-3 mt-4 animate-pulse">
                <Volume2 className="h-5 w-5 text-secondary-400" />
                <div className="bg-secondary-50 text-secondary-800 rounded-2xl px-4 py-2 max-w-[70%] border border-secondary-200 flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" /> AI is replying with a soothing voice...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {!sessionEnded && (
          <div className="flex items-center gap-4 px-6 py-4 bg-white border-t border-neutral-100">
            {!isListening && !isSpeaking ? (
              <button 
                onClick={handleStartListening} 
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Mic className="h-5 w-5 inline-block mr-2" /> Start Speaking
              </button>
            ) : isListening ? (
              <button 
                onClick={handleStopListening} 
                className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-2xl font-semibold text-lg hover:shadow-lg transition-all"
              >
                <Mic className="h-5 w-5 inline-block mr-2" /> Stop
              </button>
            ) : (
              <button 
                disabled 
                className="px-6 py-3 bg-gradient-to-r from-primary-400 to-secondary-400 text-white rounded-2xl font-semibold text-lg opacity-50 cursor-not-allowed"
              >
                <Volume2 className="h-5 w-5 inline-block mr-2" /> AI Speaking
              </button>
            )}
            <div className="flex-1"></div>
            <button 
              onClick={() => setSessionEnded(true)} 
              className="px-6 py-3 bg-gradient-to-r from-neutral-200 to-neutral-100 text-neutral-700 rounded-2xl font-semibold text-lg hover:shadow-lg transition-all"
            >
              End Session
            </button>
          </div>
        )}

        {/* Session Ended */}
        {sessionEnded && (
          <div className="flex flex-col items-center justify-center p-8">
            <h2 className="text-3xl font-bold text-primary-700 mb-4">Session Ended</h2>
            <p className="text-neutral-600 mb-6 text-center">Thank you for using HealMind AI Voice Therapy. Take care of yourself!</p>
            <button 
              className="btn-secondary text-lg" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSessionPanel; 