import React from 'react';
import { Brain, Heart, BarChart3, Shield, MessageCircle, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const FeaturesSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const features = [
    {
      icon: Brain,
      title: "Emotionally Intelligent AI",
      description: "Advanced AI that understands and responds to your emotional state with genuine empathy and personalized guidance.",
      color: "from-primary-500 to-secondary-500"
    },
    {
      icon: Heart,
      title: "Daily Mood Tracking",
      description: "Track your emotional patterns with intuitive mood logging and receive insights into your mental wellness journey.",
      color: "from-secondary-500 to-healing-500"
    },
    {
      icon: BarChart3,
      title: "Real-time Insights",
      description: "Get immediate feedback and adaptive recommendations based on your emotional patterns and therapeutic progress.",
      color: "from-healing-500 to-primary-500"
    },
    {
      icon: MessageCircle,
      title: "CBT-Based Therapy",
      description: "Clinically validated Cognitive Behavioral Therapy modules designed by mental health professionals.",
      color: "from-primary-500 to-secondary-500"
    },
    {
      icon: Shield,
      title: "Privacy-First Platform",
      description: "HIPAA-ready security ensures your mental health data is protected with enterprise-grade encryption.",
      color: "from-secondary-500 to-healing-500"
    },
    {
      icon: Zap,
      title: "Instant Support",
      description: "24/7 AI companion ready to provide immediate emotional support whenever you need it most.",
      color: "from-healing-500 to-primary-500"
    }
  ];

  return (
    <section id="features" ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Powerful Features for
            <span className="gradient-text"> Better Mental Health</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            HealMind AI combines cutting-edge technology with clinical expertise to deliver 
            personalized mental health support that adapts to your unique needs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group p-8 rounded-3xl bg-gradient-to-br from-neutral-50 to-white border border-neutral-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Feature Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>

              {/* Feature Content */}
              <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-full h-1 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Technology Showcase */}
        <div className={`mt-20 text-center transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
          <div className="glass rounded-3xl p-8 max-w-4xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
              alt="AI Technology" 
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Powered by Advanced AI Technology
            </h3>
            <p className="text-neutral-600 text-lg">
              Our proprietary AI engine processes emotional cues, language patterns, and behavioral data 
              to provide the most personalized mental health support available today.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;