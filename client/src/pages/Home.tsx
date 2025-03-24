import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HomeProps {
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
}

export default function Home({ onOpenLoginModal, onOpenSignupModal }: HomeProps) {
  // Function to create confetti effect on page load
  useEffect(() => {
    // Check if confetti is loaded
    const confettiEffect = () => {
      if (typeof window !== 'undefined' && (window as any).tsParticles?.confetti) {
        (window as any).tsParticles.confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    };
    
    // Delay the confetti effect slightly
    const timer = setTimeout(() => {
      confettiEffect();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="layout-container">
      <div className="glass-effect rounded-2xl overflow-hidden mb-12">
        <div className="p-8 md:p-16 lg:p-20 bg-gradient-to-br from-primary/90 to-purple-500/90">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-white mb-6">
              Welcome to <span className="font-extrabold">TaskSync</span>
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
              Your advanced task management system with intelligent weather integration
              and productivity analytics.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  onClick={onOpenLoginModal}
                  className="glass-effect bg-white/90 text-primary hover:bg-white w-full sm:w-auto px-8 py-6 text-lg rounded-xl font-medium shadow-lg"
                  size="lg"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i> Sign In
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={onOpenSignupModal}
                  className="button-gradient w-full sm:w-auto px-8 py-6 text-lg rounded-xl shadow-lg"
                  size="lg"
                >
                  <i className="fas fa-user-plus mr-2"></i> Get Started
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="mb-20">
        <h2 className="gradient-text text-center mb-12">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="glass-effect p-8 rounded-xl text-center card-hover"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-primary to-purple-400 inline-flex items-center justify-center mb-6 shadow-lg">
              <i className="fas fa-tasks text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Smart Task Management</h3>
            <p className="text-gray-600">Create, prioritize, and organize tasks with intelligent categorization and reminders.</p>
          </motion.div>
          
          <motion.div 
            className="glass-effect p-8 rounded-xl text-center card-hover"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 inline-flex items-center justify-center mb-6 shadow-lg">
              <i className="fas fa-cloud-sun text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Weather Integration</h3>
            <p className="text-gray-600">Seamlessly sync with real-time weather data to plan outdoor activities effectively.</p>
          </motion.div>
          
          <motion.div 
            className="glass-effect p-8 rounded-xl text-center card-hover"
            whileHover={{ y: -10 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-400 inline-flex items-center justify-center mb-6 shadow-lg">
              <i className="fas fa-chart-pie text-2xl text-white"></i>
            </div>
            <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
            <p className="text-gray-600">Gain insights into your productivity patterns with beautiful and intuitive visual reports.</p>
          </motion.div>
        </div>
      </div>
      
      <div className="glass-effect p-10 rounded-2xl text-center mb-16">
        <h2 className="gradient-text mb-6">Ready to Transform Your Productivity?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of users who have revolutionized their task management experience with TaskSync's intelligent features.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            onClick={onOpenSignupModal}
            className="button-gradient px-8 py-6 text-lg rounded-xl shadow-lg"
            size="lg"
          >
            Start Your Journey <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
