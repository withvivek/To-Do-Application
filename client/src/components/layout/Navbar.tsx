import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, logout } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onOpenLoginModal: () => void;
  onOpenSignupModal: () => void;
}

export default function Navbar({ onOpenLoginModal, onOpenSignupModal }: NavbarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [scrolled, setScrolled] = useState(false);
  
  // Detect scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return '';
    
    const names = user.name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-md py-2' 
        : 'bg-transparent py-4'
    }`}>
      <nav className="layout-container">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer">
            <Link href="/">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-md"
              >
                <i className="fas fa-tasks text-white text-lg"></i>
              </motion.div>
            </Link>
            <h2 className="gradient-text text-2xl">TaskSync</h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            {!isAuthenticated ? (
              <div className="flex items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    onClick={onOpenLoginModal}
                    className="font-medium text-gray-600 hover:text-primary"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i> Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onOpenSignupModal}
                    className="button-gradient rounded-full"
                  >
                    <i className="fas fa-user-plus mr-2"></i> Sign Up
                  </Button>
                </motion.div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                  Welcome, {user?.name}
                </span>
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.username}}`} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-purple-500 text-white font-bold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-sm font-medium"
                    size="sm"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
