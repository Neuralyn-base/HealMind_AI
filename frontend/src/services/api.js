import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const API_KEY = process.env.REACT_APP_API_KEY;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
    }
});

// Chat API endpoints
export const chatApi = {
    sendMessage: async (message, sessionId = null, context = null) => {
        try {
            const payload = {
                message,
                session_id: sessionId
            };
            if (context) payload.context = context;
            const response = await api.post('/chat/message', payload);
            return response.data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    getChatHistory: async (sessionId) => {
        try {
            const response = await api.get(`/chat/sessions/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching chat history:', error);
            throw error;
        }
    },

    getAllSessions: async () => {
        try {
            const response = await api.get('/chat/sessions');
            return response.data;
        } catch (error) {
            console.error('Error fetching all sessions:', error);
            throw error;
        }
    },

    getCopilotSummary: async (sessionId) => {
        try {
            const response = await api.get(`/chat/copilot-summary/${sessionId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching copilot summary:', error);
            throw error;
        }
    },

    // Create a new session in the backend
    createSession: async (therapy, userEmail) => {
        try {
            const payload = {
                message: `__new_session__`,
                session_id: null,
                context: null,
                metadata: { therapy: therapy?.name || therapy?.title || 'Unknown Therapy' }
            };
            const response = await api.post('/chat/message', payload, {
                headers: { 'X-User-Email': userEmail }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    }
};

// Error handling interceptor
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            // Handle specific error cases
            switch (error.response.status) {
                case 401:
                    console.error('Authentication failed');
                    break;
                case 429:
                    console.error('Rate limit exceeded');
                    break;
                case 503:
                    console.error('Service temporarily unavailable');
                    break;
                default:
                    console.error('API error:', error.response.data);
            }
        }
        return Promise.reject(error);
    }
); 