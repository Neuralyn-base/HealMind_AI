import React from 'react';
import { X, Heart, Brain, Moon, Users, TrendingUp, Smile, LogOut, BarChart2, Settings } from 'lucide-react';
import { useUser } from './UserContext';
import { useNavigate } from 'react-router-dom';

const therapies = [
  {
    key: 'anxiety',
    icon: Heart,
    title: 'Anxiety Relief',
    description: 'Guided support for managing anxiety and finding calm.'
  },
  {
    key: 'stress',
    icon: Brain,
    title: 'Stress Management',
    description: 'Personalized strategies to reduce stress and improve resilience.'
  },
  {
    key: 'sleep',
    icon: Moon,
    title: 'Sleep Improvement',
    description: 'CBT-based techniques for better sleep and relaxation.'
  },
  {
    key: 'relationships',
    icon: Users,
    title: 'Relationship Support',
    description: 'AI guidance for healthy communication and connection.'
  },
  {
    key: 'motivation',
    icon: TrendingUp,
    title: 'Motivation & Focus',
    description: 'Boost your motivation and stay on track with your goals.'
  },
  {
    key: 'selfesteem',
    icon: Smile,
    title: 'Self-Esteem',
    description: 'Build confidence and nurture a positive self-image.'
  }
];

// Define pro therapies (15, no LGBTQ topics)
const proTherapies = [
  { key: 'anxiety', icon: Heart, title: 'Anxiety Relief', description: 'Guided support for managing anxiety and finding calm.' },
  { key: 'stress', icon: Brain, title: 'Stress Management', description: 'Personalized strategies to reduce stress and improve resilience.' },
  { key: 'sleep', icon: Moon, title: 'Sleep Improvement', description: 'CBT-based techniques for better sleep and relaxation.' },
  { key: 'relationships', icon: Users, title: 'Relationship Support', description: 'AI guidance for healthy communication and connection.' },
  { key: 'motivation', icon: TrendingUp, title: 'Motivation & Focus', description: 'Boost your motivation and stay on track with your goals.' },
  { key: 'selfesteem', icon: Smile, title: 'Self-Esteem', description: 'Build confidence and nurture a positive self-image.' },
  { key: 'mindfulness', icon: Brain, title: 'Mindfulness', description: 'Be present and aware with mindfulness practices.' },
  { key: 'cbt', icon: Smile, title: 'Cognitive Behavioral Therapy', description: 'Reframe negative thoughts and behaviors.' },
  { key: 'act', icon: TrendingUp, title: 'Acceptance & Commitment', description: 'Embrace your feelings and commit to values.' },
  { key: 'dbt', icon: BarChart2, title: 'Dialectical Behavior', description: 'Balance emotions and improve distress tolerance.' },
  { key: 'solution', icon: Settings, title: 'Solution-Focused Therapy', description: 'Find practical solutions to life\'s challenges.' },
  { key: 'gratitude', icon: Smile, title: 'Gratitude Practice', description: 'Cultivate gratitude for greater happiness.' },
  { key: 'resilience', icon: TrendingUp, title: 'Resilience Building', description: 'Strengthen your ability to bounce back.' },
  { key: 'anger', icon: Brain, title: 'Anger Management', description: 'Learn to manage and express anger healthily.' },
  { key: 'wellness', icon: Heart, title: 'Holistic Wellness', description: 'Integrate mind, body, and lifestyle for well-being.' }
];

const TherapySelectionModal = ({ open, onSelect, proMode, onClose }) => {
  const { logout } = useUser();
  const navigate = useNavigate();
  if (!open) return null;
  // Use proTherapies for proMode, default therapies otherwise
  const therapiesToShow = proMode ? proTherapies : therapies;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Animated/blurred background with subtle floating shapes for proMode */}
      <div className="absolute inset-0 animate-gradient-bg" style={{
        background: proMode
          ? 'linear-gradient(120deg, #fceabb 0%, #f8b500 40%, #a8edea 100%)'
          : 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
        filter: 'blur(2.5px)',
        zIndex: 0
      }} />
      {proMode && (
        <>
          {/* Subtle animated floating shapes */}
          <div className="absolute left-1/4 top-1/4 w-32 h-32 bg-yellow-200/30 rounded-full animate-float-slow" style={{zIndex:1}} />
          <div className="absolute right-1/4 bottom-1/4 w-40 h-40 bg-blue-200/20 rounded-full animate-float-medium" style={{zIndex:1}} />
          <div className="absolute left-1/2 top-2/3 w-24 h-24 bg-pink-200/20 rounded-full animate-float-fast" style={{zIndex:1}} />
        </>
      )}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md z-10" />
      {/* Modal Card */}
      <div className={`relative z-20 bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-10 animate-scale-in mt-20 ${proMode ? 'border-4 border-yellow-400' : ''}`}>
        {/* Top-right X button for closing modal */}
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            className="text-neutral-400 hover:text-primary-500 transition-colors p-2 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 shadow"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-bold text-center text-primary-700">Select a Therapy Session</h2>
          {proMode && <span className="ml-4 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-lg font-bold shadow-lg">PRO</span>}
        </div>
        <p className="text-center text-neutral-600 mb-10">Choose the area you want to focus on today. Our AI therapist will personalize your session for you.</p>
        <div className="overflow-y-auto max-h-[60vh] scrollbar-thin scrollbar-thumb-yellow-200 scrollbar-track-yellow-50 rounded-2xl px-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {therapiesToShow.map((therapy) => (
              <button
                key={therapy.key}
                onClick={() => onSelect(therapy)}
                className={`flex items-center gap-4 p-6 rounded-2xl border-2 ${proMode ? 'border-yellow-300 hover:border-yellow-500 shadow-yellow-200' : 'border-neutral-100 hover:border-primary-300'} hover:shadow-lg transition-all bg-gradient-to-br from-neutral-50 to-primary-50`}
              >
                <div className={`p-3 rounded-xl ${proMode ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 'bg-gradient-to-r from-primary-500 to-secondary-500'} text-white`}>
                  <therapy.icon className="h-7 w-7" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-lg text-primary-700 mb-1">{therapy.title}</div>
                  <div className="text-neutral-500 text-sm">{therapy.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        .animate-gradient-bg {
          animation: gradientMove 8s ease-in-out infinite alternate;
        }
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-float-slow {
          animation: floatSlow 12s ease-in-out infinite alternate;
        }
        .animate-float-medium {
          animation: floatMedium 9s ease-in-out infinite alternate;
        }
        .animate-float-fast {
          animation: floatFast 6s ease-in-out infinite alternate;
        }
        @keyframes floatSlow {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes floatMedium {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(20px) scale(0.95); }
        }
        @keyframes floatFast {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-18px) scale(1.12); }
        }
      `}</style>
    </div>
  );
};

export default TherapySelectionModal; 