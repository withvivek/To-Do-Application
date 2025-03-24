import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="glass-effect mt-auto py-8 rounded-t-3xl">
      <div className="layout-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center shadow-md"
              >
                <i className="fas fa-tasks text-white text-lg"></i>
              </motion.div>
              <h3 className="gradient-text text-xl">TaskSync</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Your smart task management solution with weather integration and productivity analytics.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Features</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-primary transition-colors cursor-pointer">Task Management</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Weather Integration</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Productivity Analytics</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Collaboration Tools</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-primary transition-colors cursor-pointer">API Reference</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Tutorials</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Community</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-gray-600">
              <li className="hover:text-primary transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-6 bg-gray-200" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TaskSync. All rights reserved.
          </div>
          <div className="flex gap-6">
            <motion.div whileHover={{ y: -2 }} className="text-gray-500 hover:text-primary cursor-pointer">
              <i className="fab fa-twitter text-lg"></i>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="text-gray-500 hover:text-primary cursor-pointer">
              <i className="fab fa-github text-lg"></i>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="text-gray-500 hover:text-primary cursor-pointer">
              <i className="fab fa-linkedin text-lg"></i>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} className="text-gray-500 hover:text-primary cursor-pointer">
              <i className="fab fa-discord text-lg"></i>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
}
