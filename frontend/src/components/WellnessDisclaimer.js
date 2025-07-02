import React from 'react';
import { AlertTriangle, Heart, Shield } from 'lucide-react';

const WellnessDisclaimer = ({ variant = 'default', className = '' }) => {
  const variants = {
    default: (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <Heart className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Wellness & Self-Improvement Tool</p>
            <p className="text-blue-700">
              HealMind AI is designed to support your wellness journey and personal growth. 
              It is <strong>not a substitute for professional medical or mental health care</strong>. 
              If you're experiencing mental health concerns, please consult with a qualified healthcare provider.
            </p>
          </div>
        </div>
      </div>
    ),
    
    compact: (
      <div className="max-w-2xl mx-auto mt-4 mb-6 px-4">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-2 text-center shadow-sm">
          <strong>Wellness tool only.</strong> Not medical advice. Seek professional care for mental health concerns.
        </div>
      </div>
    ),
    
    banner: (
      <div className={`bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>
            <strong>Wellness & Self-Improvement Tool</strong> • Not a substitute for professional medical care
          </span>
        </div>
      </div>
    ),
    
    footer: (
      <div className={`bg-gray-50 border-t border-gray-200 p-4 ${className}`}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs text-gray-600">
            HealMind AI is a wellness and self-improvement tool designed to help with stress management, 
            mindfulness, and personal growth. It is <strong>not a substitute for professional medical 
            or mental health care</strong>. If you are experiencing mental health concerns, please 
            consult with a qualified healthcare provider. Results may vary and are not guaranteed.
          </p>
        </div>
      </div>
    ),
    
    session: (
      <div className={`bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-start space-x-3">
          <Heart className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Wellness Session</p>
            <p className="text-green-700">
              This is a wellness and self-improvement conversation designed to support your personal growth. 
              The AI companion provides guidance and support but <strong>does not provide medical advice, 
              diagnosis, or treatment</strong>. For mental health concerns, please consult a healthcare professional.
            </p>
          </div>
        </div>
      </div>
    )
  };

  return variants[variant] || variants.default;
};

export default WellnessDisclaimer; 