import React, { useEffect, useRef } from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import WellnessDisclaimer from './WellnessDisclaimer';

const HeroSection = ({ onTryFree }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section 
      ref={ref}
      className="relative min-h-screen pt-16 pb-20 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1527137342181-19aab11a8ee8" 
          alt="Serene therapeutic environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-secondary-900/70 to-healing-900/80"></div>
        <div className="absolute inset-0 grid-bg opacity-20"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-secondary-400/20 to-primary-400/20 rounded-full blur-xl floating"></div>
      <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-healing-400/20 to-secondary-400/20 rounded-full blur-2xl floating" style={{animationDelay: '2s'}}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-center w-full">
          <div className={`transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 glass rounded-full px-6 py-3 mb-8">
              <Sparkles className="h-5 w-5 text-secondary-400" />
              <span className="text-white/90 font-medium">AI-Powered Wellness Companion</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-hero font-bold text-white mb-8 leading-tight">
              Meet <span className="gradient-text text-transparent bg-clip-text bg-gradient-to-r from-secondary-300 to-healing-300">HealMind AI</span>
              <br />
              Your Smartest Path to 
              <br />
              <span className="text-healing-300">Better Wellness</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed">
              Experience AI-driven wellness support that listens, adapts, and genuinely supports you, 
              anytime, anywhere. Personalized wellness guidance powered by emotional intelligence.
            </p>

            {/* Wellness Disclaimer */}
            <div className="mb-8 max-w-2xl mx-auto">
              <WellnessDisclaimer variant="compact" className="bg-white/10 backdrop-blur-sm border-white/20" />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-secondary-500 to-primary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-glow-lg flex items-center space-x-2" onClick={onTryFree}>
                <span>Try it Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group glass text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>See How It Works</span>
              </button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">Early</div>
                <div className="text-white/70">Adopter Community</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">Positive</div>
                <div className="text-white/70">Early Feedback</div>
              </div>
              <div className="glass rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-white/70">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;