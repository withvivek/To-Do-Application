import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, fetchTasks, getWeather } from '@/lib/store';
import TaskInput from '@/components/TaskInput';
import TaskList from '@/components/TaskList';
import TaskStats from '@/components/TaskStats';
import WeatherWidget from '@/components/WeatherWidget';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [greeting, setGreeting] = useState('');
  
  // Get time-based greeting
  useEffect(() => {
    const hours = new Date().getHours();
    let greetingText = '';
    
    if (hours < 12) {
      greetingText = 'Good Morning';
    } else if (hours < 18) {
      greetingText = 'Good Afternoon';
    } else {
      greetingText = 'Good Evening';
    }
    
    setGreeting(greetingText);
  }, []);
  
  // Initial data loading
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks(user.id));
      dispatch(getWeather('New York'));
    }
  }, [dispatch, user]);
  
  const dashboardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1,
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Mobile responsive dashboard with tabs
  const MobileDashboard = () => (
    <div className="block md:hidden">
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>
        <TabsContent value="tasks" className="space-y-4">
          <TaskInput />
          <TaskList />
        </TabsContent>
        <TabsContent value="weather">
          <WeatherWidget />
        </TabsContent>
        <TabsContent value="stats">
          <TaskStats />
        </TabsContent>
      </Tabs>
    </div>
  );
  
  // Desktop dashboard
  const DesktopDashboard = () => (
    <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Task Management Column */}
      <motion.div 
        className="lg:col-span-2 space-y-6"
        variants={itemVariants}
      >
        <TaskInput />
        <TaskList />
      </motion.div>
      
      {/* Weather and Stats Column */}
      <motion.div className="space-y-6" variants={itemVariants}>
        <WeatherWidget />
        <TaskStats />
      </motion.div>
    </div>
  );
  
  return (
    <div className="layout-container">
      <motion.div 
        className="space-y-8"
        variants={dashboardVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-2">
          <h1 className="gradient-text">
            {greeting}, {user?.name}
          </h1>
          <p className="text-gray-600">
            Here's your productivity dashboard for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
        
        <MobileDashboard />
        <DesktopDashboard />
      </motion.div>
    </div>
  );
}
