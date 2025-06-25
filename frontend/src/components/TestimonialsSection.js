import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const TestimonialsSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const navigate = useNavigate();

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Manager",
      image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg",
      rating: 5,
      text: "HealMind AI has been a game-changer for my anxiety management. The AI truly understands my emotional patterns and provides personalized support that feels genuine and helpful.",
      highlight: "Reduced anxiety by 70% in 3 months"
    },
    {
      name: "Michael Rodriguez",
      role: "Software Developer", 
      image: "https://images.unsplash.com/photo-1534440163250-a4b2d8c1be5e",
      rating: 5,
      text: "As someone who struggles with expressing emotions, the AI's patient and understanding approach helped me open up and develop better coping strategies. It's like having a therapist available 24/7.",
      highlight: "Improved emotional expression and communication"
    },
    {
      name: "Dr. Emily Watson",
      role: "Healthcare Professional",
      image: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807", 
      rating: 5,
      text: "From a clinical perspective, I'm impressed by how HealMind AI incorporates evidence-based CBT techniques. It's a valuable complement to traditional therapy for my patients.",
      highlight: "Clinically validated approach"
    }
  ];

  const stats = [
    { number: "Early", label: "Users" },
    { number: "Positive", label: "Early Feedback" },
    { number: "First", label: "User Stories" },
    { number: "24/7", label: "Available Support" }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary-50 via-secondary-50 to-healing-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-40 h-40 bg-gradient-to-r from-primary-200/30 to-secondary-200/30 rounded-full blur-2xl floating"></div>
      <div className="absolute bottom-20 left-20 w-60 h-60 bg-gradient-to-r from-healing-200/30 to-primary-200/30 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Real Stories, 
            <span className="gradient-text"> Real Results</span>
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            See how HealMind AI is transforming mental health journeys for thousands of users worldwide.
          </p>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center glass rounded-2xl p-6">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.number}
              </div>
              <div className="text-neutral-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`glass rounded-3xl p-8 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                inView ? 'animate-slide-up' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.1 + 0.4}s` }}
            >
              {/* Quote Icon */}
              <div className="mb-6">
                <Quote className="h-8 w-8 text-primary-400" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-neutral-700 leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Highlight */}
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-semibold text-primary-700">
                  ✨ {testimonial.highlight}
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-neutral-600 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-20 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.8s'}}>
          <div className="glass rounded-3xl p-12 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-neutral-900 mb-6">
              Join Our Early Community
            </h3>
            <p className="text-lg text-neutral-600 mb-8">
              Early feedback has been overwhelmingly positive. Start your personalized mental health journey today and help us build the future of AI therapy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary text-lg" onClick={() => navigate('/free-dashboard')}>
                Start Free Trial
              </button>
              <button className="btn-secondary text-lg">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;