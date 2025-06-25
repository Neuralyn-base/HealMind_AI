import React from 'react';
import { MessageSquare, Brain, TrendingUp, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const StepByStep = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      icon: MessageSquare,
      title: "Express How You're Feeling",
      description: "Share your thoughts, emotions, and experiences through our intuitive chat interface. Our AI listens with empathy and understanding.",
      features: ["Natural conversation flow", "Emotional tone analysis", "Safe, judgment-free space"],
      color: "from-primary-500 to-secondary-500"
    },
    {
      number: 2,
      icon: Brain,
      title: "Receive Personalized AI-Driven Guidance",
      description: "Get immediate, personalized responses based on cognitive behavioral therapy principles and your unique emotional patterns.",
      features: ["CBT-based interventions", "Personalized coping strategies", "Real-time emotional support"],
      color: "from-secondary-500 to-healing-500"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Monitor and Reflect on Your Growth",
      description: "Track your progress with detailed insights, mood analytics, and personalized recommendations for continued improvement.",
      features: ["Progress tracking", "Mood pattern analysis", "Personalized insights"],
      color: "from-healing-500 to-primary-500"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1473091534298-04dcbce3278c" 
          alt="Modern wellness technology" 
          className="w-full h-full object-cover opacity-5"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            How 
            <span className="gradient-text"> HealMind AI Works</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Three simple steps to begin your personalized mental health journey with AI-powered support that adapts to your unique needs.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-24">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 transition-all duration-1000 ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Step Content */}
              <div className="flex-1 space-y-6">
                {/* Step Number */}
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {step.number}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color}`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="text-3xl md:text-4xl font-bold text-neutral-900">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-lg text-neutral-600 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Features */}
                <div className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color}`}></div>
                      <span className="text-neutral-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                {index === steps.length - 1 && (
                  <button className="btn-primary mt-8 flex items-center space-x-2" onClick={() => navigate('/free-dashboard')}>
                    <span>Start Your Journey</span>
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Step Visual */}
              <div className="flex-1">
                <div className={`relative p-8 glass rounded-3xl shadow-xl bg-gradient-to-br ${step.color.replace('from-', 'from-').replace('to-', 'to-')}/10`}>
                  {/* Step Number Background */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-700">{step.number}</span>
                  </div>

                  {/* Content Area */}
                  <div className="space-y-4">
                    {step.number === 1 && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 h-3 bg-gradient-to-r from-primary-200 to-transparent rounded-full"></div>
                        </div>
                        <div className="bg-white/50 p-4 rounded-xl">
                          <p className="text-sm text-neutral-700">"I've been feeling really anxious lately about work..."</p>
                        </div>
                        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl">
                          <p className="text-sm text-neutral-700">"I understand. Can you tell me more about what's causing this anxiety?"</p>
                        </div>
                      </div>
                    )}

                    {step.number === 2 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center">
                          <Brain className="h-16 w-16 text-secondary-500" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white/50 p-3 rounded-lg text-center">
                            <div className="text-xs text-neutral-600">CBT Technique</div>
                            <div className="font-medium text-secondary-600">Thought Reframing</div>
                          </div>
                          <div className="bg-white/50 p-3 rounded-lg text-center">
                            <div className="text-xs text-neutral-600">Personalized</div>
                            <div className="font-medium text-healing-600">Breathing Exercise</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {step.number === 3 && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-700">Weekly Progress</span>
                          <TrendingUp className="h-5 w-5 text-healing-500" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-neutral-600">
                            <span>Mood Score</span>
                            <span>8.2/10</span>
                          </div>
                          <div className="w-full bg-neutral-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-healing-400 to-primary-400 h-2 rounded-full" style={{width: '82%'}}></div>
                          </div>
                        </div>
                        <div className="bg-white/50 p-3 rounded-lg">
                          <p className="text-xs text-neutral-700">✨ 15% improvement in anxiety levels this week</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepByStep;