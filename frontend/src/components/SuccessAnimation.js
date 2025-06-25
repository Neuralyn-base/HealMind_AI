import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

// Simple confetti effect
const Confetti = () => {
  const confettiColors = [
    '#6EE7B7', '#3B82F6', '#A5B4FC', '#F472B6', '#FBBF24', '#F87171', '#818CF8', '#34D399'
  ];
  const confettiPieces = Array.from({ length: 24 });
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: 0,
            x: 0,
            opacity: 1,
            rotate: 0,
            scale: 1
          }}
          animate={{
            y: [0, 120 + Math.random() * 80],
            x: [(Math.random() - 0.5) * 300],
            opacity: [1, 1, 0],
            rotate: [0, 360 * (Math.random() - 0.5)],
            scale: [1, 1.2, 0.8]
          }}
          transition={{ duration: 1.2 + Math.random() * 0.5, delay: Math.random() * 0.2 }}
          style={{
            position: 'absolute',
            left: `calc(50% + ${(Math.random() - 0.5) * 120}px)`,
            top: '40%',
            width: 12,
            height: 12,
            borderRadius: 3,
            background: confettiColors[i % confettiColors.length],
            zIndex: 100
          }}
        />
      ))}
    </div>
  );
};

const SuccessAnimation = ({ message = "You're in! Welcome to HealMind AI." }) => {
  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      <Confetti />
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        className="mb-4"
      >
        <CheckCircle size={64} className="text-green-400 drop-shadow-xl" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary-500 via-secondary-500 to-green-400 bg-clip-text text-transparent animate-gradient-x"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-x 2s linear infinite'
        }}
      >
        {message}
      </motion.h2>
      <style>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation; 