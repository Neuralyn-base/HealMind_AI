import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const VoiceInteraction = ({ onResponse, language = 'en', voiceGender = 'female', style = 'calm' }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);
    const { user } = useAuth();

    useEffect(() => {
        // Cleanup function
        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                mediaRecorder.current.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorder.current.ondataavailable = (event) => {
                audioChunks.current.push(event.data);
            };

            mediaRecorder.current.onstop = async () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                await processAudio(audioBlob);
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            toast.error('Could not access microphone. Please check permissions.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    const processAudio = async (audioBlob) => {
        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob);
            formData.append('settings', JSON.stringify({
                language,
                voice_gender: voiceGender,
                style
            }));

            const response = await fetch('/api/voice/process', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to process audio');
            }

            // Get the transcribed text and AI response from headers
            const transcribedText = response.headers.get('X-Transcribed-Text');
            const aiResponse = response.headers.get('X-AI-Response');

            // Create audio element for playback
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);

            // Play the audio response
            audio.play();

            // Call the onResponse callback with the transcribed text and AI response
            if (onResponse) {
                onResponse({
                    transcribedText,
                    aiResponse,
                    audioUrl
                });
            }
        } catch (error) {
            console.error('Error processing audio:', error);
            toast.error('Failed to process audio. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`p-4 rounded-full ${
                    isRecording 
                        ? 'bg-red-500 hover:bg-red-600' 
                        : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors duration-200`}
            >
                {isRecording ? (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )}
            </button>
            <div className="text-sm text-gray-600">
                {isRecording ? 'Recording...' : isProcessing ? 'Processing...' : 'Click to start recording'}
            </div>
        </div>
    );
};

export default VoiceInteraction; 