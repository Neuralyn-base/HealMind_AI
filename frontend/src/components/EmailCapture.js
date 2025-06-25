import React, { useState } from 'react';
import { Mail, Shield, Gift, ArrowRight } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const EmailCapture = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) return;
      setIsSubmitted(true);
    // Optionally, send to backend here
    // await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
    }, 4000);
  };

  const benefits = [
    {
      icon: Gift,
      title: "Early Access",
      description: "Be first to try new features and get exclusive beta access"
    },
    {
      icon: Mail,
      title: "Weekly Insights",
      description: "Receive curated mental health tips and AI therapy insights"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your email is secure - we never share or sell your information"
    }
  ];

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-primary-600 via-secondary-600 to-healing-600 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl floating"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/5 rounded-full blur-3xl floating" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 grid-bg opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className={`text-white transition-all duration-1000 ${inView ? 'animate-slide-in-left' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className="inline-flex items-center space-x-2 bg-white/10 rounded-full px-6 py-3 mb-6">
                <Gift className="h-5 w-5 text-secondary-200" />
                <span className="text-white/90 font-medium">Exclusive Access</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get Early Access to
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-secondary-200"> Advanced Features</span>
              </h2>
              
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Join our community of mental health advocates and get exclusive access to new AI therapy features, 
                research insights, and personalized wellness content.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4"
                >
                  <div className="p-2 bg-white/10 rounded-xl">
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-white/70">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Side */}
          <div className={`transition-all duration-1000 ${inView ? 'animate-slide-in-right' : 'opacity-0'}`}>
            <div className="glass-dark rounded-3xl p-8 lg:p-12">
              {!isSubmitted ? (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-secondary-400 to-healing-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Mail className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Join the Waitlist
                    </h3>
                    <p className="text-white/70">
                      Be among the first to experience next-generation AI therapy features.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-white/80 font-medium mb-3">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-white to-white/90 text-primary-600 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group"
                    >
                      <span>Get Early Access</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>

                  {/* Trust Indicators */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-center space-x-6 text-white/60 text-sm">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4" />
                        <span>No spam</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Unsubscribe anytime</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-healing-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <ArrowRight className="h-8 w-8 text-white transform rotate-90" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Welcome to the Community!
                  </h3>
                  <p className="text-white/70">
                    Thank you for joining. Your subscription will be sent to nithin@neuralyn.health.
                  </p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center glass-dark rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">Early</div>
                <div className="text-white/60 text-sm">Community</div>
              </div>
              <div className="text-center glass-dark rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">Positive</div>
                <div className="text-white/60 text-sm">Early Feedback</div>
              </div>
              <div className="text-center glass-dark rounded-2xl p-4">
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-white/60 text-sm">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmailCapture;