import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import InteractiveDemo from './InteractiveDemo';
import StepByStep from './StepByStep';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import FounderSection from './FounderSection';
import EmailCapture from './EmailCapture';
import BlogSection from './BlogSection';
import Footer from './Footer';
import TherapySelectionModal from './TherapySelectionModal';
import LiveSessionDashboard from './LiveSessionDashboard';

const LandingPage = () => {
  const [showTherapyModal, setShowTherapyModal] = useState(false);
  const [selectedTherapy, setSelectedTherapy] = useState(null);
  const [showLiveSessionDashboard, setShowLiveSessionDashboard] = useState(false);

  // Handler for when a therapy is selected (to be implemented)
  const handleTherapySelect = (therapy) => {
    setShowTherapyModal(false);
    setSelectedTherapy(therapy);
    setShowLiveSessionDashboard(true);
  };

  const handleCloseDashboard = () => {
    setShowLiveSessionDashboard(false);
    setSelectedTherapy(null);
  };

  // Force scroll to top on initial load, regardless of hash or browser scroll restoration
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-healing-50 to-primary-50">
      <Navigation onTryFree={() => setShowTherapyModal(true)} />
      <HeroSection onTryFree={() => setShowTherapyModal(true)} />
      <FeaturesSection />
      <InteractiveDemo />
      <StepByStep />
      <TestimonialsSection />
      <PricingSection />
      <FounderSection />
      <EmailCapture />
      <BlogSection />
      <Footer />
      <TherapySelectionModal
        open={showTherapyModal}
        onClose={() => setShowTherapyModal(false)}
        onSelect={handleTherapySelect}
      />
      {showLiveSessionDashboard && selectedTherapy && (
        <LiveSessionDashboard
          open={showLiveSessionDashboard}
          onClose={handleCloseDashboard}
          therapy={selectedTherapy}
        />
      )}
    </div>
  );
};

export default LandingPage;