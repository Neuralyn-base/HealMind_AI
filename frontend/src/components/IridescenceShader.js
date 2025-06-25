import React from 'react';

const values = [
  'Empathy',
  'Healing',
  'Emotional Intelligence',
  'Trust',
  'Human + AI',
  'Growth',
  'Mindfulness',
  'Wellness',
  'Every mind matters.',
  'Your journey to healing starts here.'
];

const IridescenceShader = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: -1,
      overflow: 'hidden',
    }}
  >
    {/* Background Image */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: `url('/image/SignIn-SignUp image.png') center center / cover no-repeat`,
        zIndex: 1,
      }}
    />
    {/* Glossy/Frosted Overlay */}
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(255,255,255,0.60)',
        backdropFilter: 'blur(16px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.2)',
        zIndex: 2,
      }}
    />
    {/* Vertical Company/Values List */}
    <div
      className="hidden md:flex flex-col items-start justify-center"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100vh',
        width: '320px',
        paddingLeft: '48px',
        zIndex: 3,
        pointerEvents: 'none',
      }}
    >
      {values.map((val, i) => (
        <div
          key={val}
          style={{
            fontSize: i > 7 ? 18 : 22,
            fontWeight: i > 7 ? 500 : 600,
            color: 'rgba(80, 100, 160, 0.18)',
            letterSpacing: 1.2,
            marginBottom: i === values.length - 1 ? 0 : 18,
            textShadow: '0 2px 16px rgba(160,180,255,0.08)',
            opacity: 0.85,
            animation: `fadeFloat 2.5s ${0.2 * i}s both`,
            fontStyle: i > 7 ? 'italic' : 'normal',
            maxWidth: 260,
            lineHeight: 1.3,
            userSelect: 'none',
          }}
        >
          {val}
        </div>
      ))}
    </div>
    <style>{`
      @keyframes fadeFloat {
        0% { opacity: 0; transform: translateY(20px); }
        100% { opacity: 0.85; transform: translateY(0); }
      }
      @media (max-width: 900px) {
        .md\\:flex { display: none !important; }
      }
    `}</style>
  </div>
);

export default IridescenceShader; 