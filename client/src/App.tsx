import React, { useState, useEffect } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, restoreAuth } from '@/lib/store';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { Toaster } from "@/components/ui/toaster";

// Pages
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import NotFound from "@/pages/not-found";

// Components
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';

// Add external scripts
const addExternalScripts = () => {
  // Font Awesome script
  const faScript = document.createElement('script');
  faScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js';
  faScript.defer = true;
  document.head.appendChild(faScript);
  
  // Add animated background effect
  const particlesScript = document.createElement('script');
  particlesScript.src = 'https://cdn.jsdelivr.net/npm/tsparticles-confetti@2.12.0/tsparticles.confetti.bundle.min.js';
  particlesScript.defer = true;
  document.head.appendChild(particlesScript);
  
  return () => {
    document.head.removeChild(faScript);
    document.head.removeChild(particlesScript);
  };
};

function AppContent() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [location, setLocation] = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  
  // Check for existing authentication on page load
  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);
  
  // Add external scripts
  useEffect(() => {
    const cleanup = addExternalScripts();
    return cleanup;
  }, []);
  
  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && location === '/') {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, location, setLocation]);
  
  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
  };
  
  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };
  
  const handleOpenSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
  };
  
  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };
  
  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };
  
  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onOpenLoginModal={handleOpenLoginModal} 
        onOpenSignupModal={handleOpenSignupModal} 
      />
      
      <main className="flex-grow">
        <Switch>
          <Route path="/">
            <Home 
              onOpenLoginModal={handleOpenLoginModal} 
              onOpenSignupModal={handleOpenSignupModal} 
            />
          </Route>
          
          {isAuthenticated && (
            <Route path="/dashboard">
              <Dashboard />
            </Route>
          )}
          
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </main>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={handleCloseLoginModal}
        onSwitchToSignup={handleSwitchToSignup}
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={handleCloseSignupModal}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
