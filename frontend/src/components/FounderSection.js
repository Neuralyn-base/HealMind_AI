import React from 'react';
import { GraduationCap, Award, Users, Heart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FounderSection = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });
  const navigate = useNavigate();

  const credentials = [
    {
      icon: GraduationCap,
      title: "AI HealthTech Founder",
      description: "Global impact in AI, ML, and digital health innovation"
    },
    {
      icon: Heart,
      title: "Visionary Leader",
      description: "Transforming healthcare with emotionally intelligent AI"
    },
    {
      icon: Award,
      title: "Global Educator",
      description: "Taught 3500+ students in 100+ countries"
    }
  ];

  const achievements = [
    { number: "Expert", label: "in AI & HealthTech" },
    { number: "Global", label: "Impact" },
    { number: "Mission-Driven", label: "Innovation" }
  ];

  return (
    <section id="founder" ref={ref} className="py-24 bg-gradient-to-br from-healing-50 via-primary-50 to-secondary-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-secondary-200/30 to-healing-200/30 rounded-full blur-2xl floating"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-primary-200/30 to-secondary-200/30 rounded-full blur-3xl floating" style={{animationDelay: '3s'}}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`}>
          <h2 className="text-5xl font-extrabold text-neutral-900 mb-4 tracking-tight whitespace-nowrap">
            Meet the Visionary Behind HealMind_AI
          </h2>
        </div>

        {/* Professional Founder Layout with Subtle Animations */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 mb-20">
          {/* Founder Image with Animation */}
          <motion.div
            className="flex-shrink-0 mx-auto md:mx-0"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
          >
            <div className="relative w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-tr from-primary-400 via-secondary-400 to-healing-400 p-2 animate-glow">
              <img src="/image/profile-pic-3.PNG" alt="Nithin Rajulapati" className="w-full h-full rounded-full object-cover border-4 border-white shadow-2xl" />
            </div>
          </motion.div>
          {/* Founder Info with Animation */}
          <motion.div
            className="flex-1 flex flex-col gap-6 md:pt-4"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            viewport={{ once: true }}
          >
                  <div>
              <motion.h1 className="text-3xl md:text-4xl font-extrabold text-primary-700 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>Nithin Rajulapati</motion.h1>
              <motion.div className="text-primary-500 font-semibold text-lg mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Founder & CTO, Neuralyn</motion.div>
              <motion.div className="text-neutral-700 text-lg font-medium mb-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                Building the future of mental health with empathy, intelligence, and relentless optimism.
              </motion.div>
            </div>
            {/* Inspirational Quote */}
            <motion.div
              className="bg-white/90 border-l-4 border-primary-400 rounded-2xl shadow p-5 mb-2 max-w-xl"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="block text-lg text-neutral-800 font-medium mb-2">
                "Every breakthrough in technology is an opportunity to make life more human. My mission is to create AI that listens, understands, and empowers people to heal and grow."
              </span>
            </motion.div>
            {/* Highlights with Staggered Animation */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={{ visible: { transition: { staggerChildren: 0.18 } } }}
              viewport={{ once: true }}
            >
              <h2 className="text-xl font-bold text-primary-700 mb-2">Highlights</h2>
              <motion.ul className="list-disc pl-6 space-y-2 text-neutral-700 text-base">
                <motion.li variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
                  Pioneer in AI-driven mental health solutions
                </motion.li>
                <motion.li variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
                  Passionate about making emotional support accessible to all
                </motion.li>
                <motion.li variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
                  Lifelong learner and global educator
                </motion.li>
                <motion.li variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
                  Committed to building technology that uplifts humanity
                </motion.li>
                <motion.li variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
                  Leading a team dedicated to real-world impact
                </motion.li>
              </motion.ul>
            </motion.div>
            {/* Location */}
            <motion.div className="text-neutral-500 text-sm mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>Chicago, IL, USA</motion.div>
          </motion.div>
        </div>

        {/* New CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 ${inView ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.6s'}}>
          <div className="glass rounded-3xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-neutral-900 mb-4">
              Join Our Mission
            </h3>
            <p className="text-neutral-600 mb-6">
              We're building HealMind AI to make emotional healing accessible, intelligent, and deeply human. Early feedback from our first testers has been amazing—join us and help shape the future of mental health support.
            </p>
            <button className="btn-primary text-lg" onClick={() => navigate('/free-dashboard')}>
              Get Early Access
            </button>
          </div>
        </div>
      </div>
      <style>{`
        .animate-glow {
          box-shadow: 0 0 32px 8px #a67cff44, 0 0 0 8px #36aaf733;
          animation: founder-glow 2.5s ease-in-out infinite alternate;
        }
        @keyframes founder-glow {
          0% { box-shadow: 0 0 32px 8px #a67cff44, 0 0 0 8px #36aaf733; }
          100% { box-shadow: 0 0 64px 16px #a67cff99, 0 0 0 16px #36aaf799; }
        }
      `}</style>
    </section>
  );
};

export default FounderSection;