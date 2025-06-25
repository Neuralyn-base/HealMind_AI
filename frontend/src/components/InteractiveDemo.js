import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Bot, User, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { chatApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const InteractiveDemo = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      type: 'ai',
      text: "Hello! I'm HealMind AI. I'm here to support your mental wellness journey. How are you feeling today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatApi.sendMessage(inputValue, sessionId);
      
      if (!sessionId && response.session_id) {
        setSessionId(response.session_id);
      }

      const aiMessage = {
        type: 'ai',
        text: response.response,
        timestamp: new Date(response.created_at),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError('Sorry, I encountered an error. Please try again.');
      console.error('Error in chat:', err);
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

  const quickResponses = [
    "I'm feeling anxious today",
    "I've been stressed at work",
    "I'm having trouble sleeping",
    "I feel overwhelmed"
  ];

  return (
    <section id="demo" ref={ref} className="py-24 bg-gradient-to-br from-healing-50 to-primary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-secondary-200/30 to-primary-200/30 rounded-full blur-2xl floating"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-gradient-to-r from-healing-200/30 to-secondary-200/30 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-6">
            <Sparkles className="h-5 w-5 text-primary-500" />
            <span className="text-primary-700 font-medium">Interactive Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Experience 
            <span className="gradient-text"> AI Emotional Intelligence</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Try our live demo and see how HealMind AI understands, responds, and adapts to your emotional needs in real-time.
          </p>
        </div>

        {/* Demo Container */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${inView ? 'animate-scale-in' : 'opacity-0'}`} style={{animationDelay: '0.3s'}}>
          <div className="glass rounded-3xl overflow-hidden shadow-2xl">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HealMind AI Therapist</h3>
                  <p className="text-primary-100 text-sm">Online • Ready to help</p>
                </div>
                <div className="ml-auto flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-primary-100">Emotionally Aware</span>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-96 bg-white p-6 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                  >
                    <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-2 rounded-xl ${message.type === 'user' ? 'bg-primary-500' : 'bg-gradient-to-r from-secondary-400 to-healing-400'}`}>
                        {message.type === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-white" />
                        )}
                      </div>
                      <div className={`p-4 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-gradient-to-r from-neutral-100 to-neutral-50 text-neutral-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gradient-to-r from-secondary-400 to-healing-400 rounded-xl">
                        <Bot className="h-5 w-5 text-white" />
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

                {error && (
                  <div className="flex justify-center animate-slide-up">
                    <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                      {error}
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Response Buttons */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100">
              <p className="text-sm text-neutral-600 mb-3">Quick responses:</p>
              <div className="flex flex-wrap gap-2">
                {quickResponses.map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setInputValue(response)}
                    className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-700 hover:border-primary-300 hover:text-primary-600 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-neutral-100">
              <div className="flex space-x-3">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share how you're feeling..."
                  className="flex-1 p-4 border border-neutral-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="2"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-6 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-2xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call-to-Action */}
        <div className={`text-center mt-12 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
          <p className="text-lg text-neutral-600 mb-6">
            Ready to start your personalized mental health journey?
          </p>
          <button className="btn-primary text-lg" onClick={() => navigate('/free-dashboard')}>
            Start Your Free Session
          </button>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;