import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import LandingPage from './components/LandingPage';
import { UserProvider, useUser } from './components/UserContext';
import AuthPage from './components/AuthPage';
import ProDashboard from './components/ProDashboard';
import LiveSessionDashboard from './components/LiveSessionDashboard';
import TherapySelectionModal from './components/TherapySelectionModal';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </UserProvider>
    </div>
  );
}

function AppRouter() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    if (location.pathname === '/') {
      if (user.isPro) {
        navigate('/pro-dashboard', { replace: true });
      } else {
        navigate('/free-dashboard', { replace: true });
      }
    }
    // Redirect if user tries to access the wrong dashboard
    if (user.isPro && location.pathname === '/free-dashboard') {
      navigate('/pro-dashboard', { replace: true });
    } else if (!user.isPro && location.pathname === '/pro-dashboard') {
      navigate('/free-dashboard', { replace: true });
    }
  }, [user, location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/pro-dashboard" element={user && user.isPro ? <ProDashboard /> : null} />
      <Route path="/free-dashboard" element={user && !user.isPro ? <FreeDashboardWrapper /> : null} />
    </Routes>
  );
}

// FreeDashboardWrapper: handles therapy selection and session for free users
function FreeDashboardWrapper() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [showTherapyModal, setShowTherapyModal] = useState(true);
  const [selectedTherapy, setSelectedTherapy] = useState(null);

  // Guard: If user is Pro, redirect to /pro-dashboard
  useEffect(() => {
    if (user && user.isPro) {
      navigate('/pro-dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleTherapySelect = (therapy) => {
    setShowTherapyModal(false);
    setSelectedTherapy(therapy);
  };
  const handleCloseDashboard = () => {
    setSelectedTherapy(null);
    setShowTherapyModal(true);
  };
  if (!showTherapyModal && !selectedTherapy) {
    // Show landing page or a call-to-action for free users
    return <LandingPage />;
  }
  return (
    <>
      <TherapySelectionModal open={showTherapyModal} onClose={() => setShowTherapyModal(false)} onSelect={handleTherapySelect} />
      {selectedTherapy && (
        <LiveSessionDashboard open={true} onClose={handleCloseDashboard} therapy={selectedTherapy} />
      )}
    </>
  );
}

export default App;