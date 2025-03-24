import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { apiRequest } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3Icon, ClockIcon, CalendarIcon, 
  AlertCircleIcon, FilterIcon, CheckCircleIcon,
  CloudSunIcon, PlusIcon, 
} from 'lucide-react';

interface TaskStats {
  total: number;
  dueToday: number;
  outdoor: number;
  createdThisWeek: number;
  priorities: {
    high: number;
    medium: number;
    low: number;
    highPercentage: number;
    mediumPercentage: number;
    lowPercentage: number;
  };
}

export default function TaskStats() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiRequest('GET', `/api/tasks/stats/${user.id}`, undefined);
        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch task statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };
  
  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (width: number) => ({
      width: `${width}%`,
      transition: { duration: 0.8, ease: "easeOut" }
    })
  };
  
  if (loading) {
    return (
      <motion.div 
        className="task-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          
          <Skeleton className="h-6 w-1/4 mt-8" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
            <Skeleton className="h-24 rounded-lg" />
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (error) {
    return (
      <motion.div 
        className="task-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-red-400 flex items-center justify-center shadow-md">
            <BarChart3Icon className="h-5 w-5 text-white" />
          </div>
          <h2 className="gradient-text text-2xl">Task Analytics</h2>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center">
          <AlertCircleIcon className="h-12 w-12 text-rose-400 mx-auto mb-3" />
          <h3 className="text-rose-700 font-medium mb-2">Statistics Unavailable</h3>
          <p className="text-rose-600 text-sm">
            {error}
          </p>
        </div>
      </motion.div>
    );
  }
  
  if (!stats) {
    return (
      <motion.div 
        className="task-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 flex items-center justify-center shadow-md">
            <BarChart3Icon className="h-5 w-5 text-white" />
          </div>
          <h2 className="gradient-text text-2xl">Task Analytics</h2>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="glass-effect p-8 text-center">
          <BarChart3Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-600 mb-2">No Statistics Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Start adding tasks to see your progress analytics and performance metrics
          </p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="task-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 flex items-center justify-center shadow-md">
          <BarChart3Icon className="h-5 w-5 text-white" />
        </div>
        <h2 className="gradient-text text-2xl">Task Analytics</h2>
      </motion.div>
      
      <Separator className="mb-6" />
      
      <motion.div variants={itemVariants} className="space-y-8">
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-gray-700" />
            <span>Task Distribution by Priority</span>
          </h3>
          
          <div className="glass-effect p-4 rounded-xl">
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div className="flex h-full">
                <motion.div 
                  className="bg-gradient-to-r from-rose-500 to-rose-400 h-full"
                  custom={stats.priorities.highPercentage}
                  variants={progressBarVariants}
                ></motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-amber-500 to-amber-400 h-full"
                  custom={stats.priorities.mediumPercentage}
                  variants={progressBarVariants}
                ></motion.div>
                <motion.div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-full"
                  custom={stats.priorities.lowPercentage}
                  variants={progressBarVariants}
                ></motion.div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <AlertCircleIcon className="h-4 w-4 text-rose-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">High</span>
                </div>
                <motion.div 
                  className="text-lg font-semibold text-rose-600"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {stats.priorities.high}
                </motion.div>
                <span className="text-xs text-gray-500">({stats.priorities.highPercentage}%)</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <FilterIcon className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">Medium</span>
                </div>
                <motion.div 
                  className="text-lg font-semibold text-amber-600"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {stats.priorities.medium}
                </motion.div>
                <span className="text-xs text-gray-500">({stats.priorities.mediumPercentage}%)</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-1">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs font-medium text-gray-700">Low</span>
                </div>
                <motion.div 
                  className="text-lg font-semibold text-green-600"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {stats.priorities.low}
                </motion.div>
                <span className="text-xs text-gray-500">({stats.priorities.lowPercentage}%)</span>
              </div>
            </div>
          </div>
        </div>

        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-700" />
            <span>Task Overview</span>
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className="glass-effect rounded-xl p-4 transition-colors hover:bg-white card-hover"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">All Tasks</div>
                  <motion.div 
                    className="text-3xl font-semibold bg-gradient-to-r from-primary to-purple-400 text-transparent bg-clip-text"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {stats.total}
                  </motion.div>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <PlusIcon className="h-5 w-5 text-purple-500" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-effect rounded-xl p-4 transition-colors hover:bg-white card-hover"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Due Today</div>
                  <motion.div 
                    className="text-3xl font-semibold text-rose-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {stats.dueToday}
                  </motion.div>
                </div>
                <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                  <CalendarIcon className="h-5 w-5 text-rose-500" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-effect rounded-xl p-4 transition-colors hover:bg-white card-hover"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Outdoor Tasks</div>
                  <motion.div 
                    className="text-3xl font-semibold text-blue-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {stats.outdoor}
                  </motion.div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CloudSunIcon className="h-5 w-5 text-blue-500" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-effect rounded-xl p-4 transition-colors hover:bg-white card-hover"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">This Week</div>
                  <motion.div 
                    className="text-3xl font-semibold text-cyan-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {stats.createdThisWeek}
                  </motion.div>
                </div>
                <div className="h-10 w-10 rounded-full bg-cyan-100 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
