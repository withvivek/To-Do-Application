import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, fetchTasks, deleteTask, filterTasks } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Trash2Icon, CalendarIcon, ClockIcon, FilterIcon, 
  SunIcon, CloudIcon, AlertCircleIcon, CheckCircleIcon, 
  CloudLightningIcon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { filteredTasks, loading, filter } = useSelector((state: RootState) => state.tasks);
  const weatherData = useSelector((state: RootState) => state.weather.data);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch tasks when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTasks(user.id));
    }
  }, [dispatch, user]);
  
  const handleDelete = async (taskId: number) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: typeof error === 'string' ? error : "Failed to delete task",
        variant: "destructive",
      });
    }
  };
  
  const handleFilter = (filterValue: string) => {
    dispatch(filterTasks(filterValue));
  };
  
  // Filter tasks based on search term
  const searchFilteredTasks = searchTerm 
    ? filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredTasks;
  
  // Priority badge variants
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return { 
          variant: 'destructive' as const,
          label: 'High Priority',
          border: 'border-rose-500',
          bg: 'bg-rose-50',
          icon: <AlertCircleIcon className="h-4 w-4 text-rose-500" />,
          textColor: 'text-rose-700'
        };
      case 'medium':
        return { 
          variant: 'warning' as const,
          label: 'Medium Priority',
          border: 'border-amber-500',
          bg: 'bg-amber-50',
          icon: <FilterIcon className="h-4 w-4 text-amber-500" />,
          textColor: 'text-amber-700'
        };
      case 'low':
        return { 
          variant: 'success' as const,
          label: 'Low Priority',
          border: 'border-green-500',
          bg: 'bg-green-50',
          icon: <CheckCircleIcon className="h-4 w-4 text-green-500" />,
          textColor: 'text-green-700'
        };
      default:
        return { 
          variant: 'outline' as const,
          label: 'Unknown',
          border: 'border-gray-500',
          bg: 'bg-gray-50',
          icon: <CloudIcon className="h-4 w-4 text-gray-500" />,
          textColor: 'text-gray-700'
        };
    }
  };
  
  // Format date for display
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return 'No due date';
    
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    // Check if date is today or tomorrow
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return format(taskDate, 'MMM d, yyyy');
    }
  };
  
  // Find weather for outdoor tasks
  const getTaskWeather = (isOutdoor: boolean) => {
    if (!isOutdoor || !weatherData) return null;
    
    return {
      temp: weatherData.current.temp,
      description: weatherData.current.weather[0].description,
      icon: weatherData.current.weather[0].icon
    };
  };
  
  // Task card animation variants
  const taskListVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const taskCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };
  
  // Empty state animations
  const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="task-container"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
            <ClockIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="gradient-text text-2xl">Your Tasks</h2>
          <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-100">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </Badge>
        </div>
        
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-glass w-full md:w-auto md:min-w-[250px]"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all" onClick={() => handleFilter('all')}>All</TabsTrigger>
          <TabsTrigger 
            value="high" 
            onClick={() => handleFilter('high')}
            className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700"
          >
            High
          </TabsTrigger>
          <TabsTrigger 
            value="medium" 
            onClick={() => handleFilter('medium')}
            className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700"
          >
            Medium
          </TabsTrigger>
          <TabsTrigger 
            value="low" 
            onClick={() => handleFilter('low')}
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
          >
            Low
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Separator className="mb-6" />
      
      {loading ? (
        // Loading state
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-effect p-4 rounded-xl">
              <div className="flex justify-between">
                <div className="space-y-3 w-full">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-3 mt-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : searchFilteredTasks.length === 0 ? (
        // Empty state
        <motion.div 
          className="flex flex-col items-center justify-center py-16 text-center"
          variants={emptyStateVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
            {searchTerm ? (
              <motion.div 
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <FilterIcon className="h-10 w-10 text-gray-400" />
              </motion.div>
            ) : filter !== 'all' ? (
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                {filter === 'high' && <AlertCircleIcon className="h-10 w-10 text-rose-400" />}
                {filter === 'medium' && <FilterIcon className="h-10 w-10 text-amber-400" />}
                {filter === 'low' && <CheckCircleIcon className="h-10 w-10 text-green-400" />}
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
              >
                <ClockIcon className="h-10 w-10 text-gray-400" />
              </motion.div>
            )}
          </div>
          
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {searchTerm 
              ? 'No matching tasks found' 
              : filter !== 'all'
                ? `No ${filter} priority tasks` 
                : 'No tasks yet'}
          </h3>
          
          <p className="text-gray-600 max-w-sm">
            {searchTerm 
              ? 'Try searching with different keywords or clear the search' 
              : filter !== 'all'
                ? `You don't have any tasks with ${filter} priority yet`
                : 'Start by adding a new task using the form above'}
          </p>
          
          {(searchTerm || filter !== 'all') && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                handleFilter('all');
              }}
              className="mt-6"
            >
              Clear Filters
            </Button>
          )}
        </motion.div>
      ) : (
        // Task list
        <motion.div 
          className="space-y-4"
          variants={taskListVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {searchFilteredTasks.map((task) => {
              const priority = getPriorityBadge(task.priority);
              const taskWeather = getTaskWeather(task.isOutdoor);
              const isToday = formatDate(task.dueDate) === 'Today';
              
              return (
                <motion.div 
                  key={task.id}
                  variants={taskCardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className={`glass-effect card-hover rounded-xl overflow-hidden ${priority.bg}`}
                >
                  <div className="flex items-center justify-between border-b border-gray-100 p-4">
                    <div className="flex items-center gap-2">
                      {priority.icon}
                      <span className={`text-sm font-medium ${priority.textColor}`}>
                        {priority.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isToday && (
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          Due Today
                        </Badge>
                      )}
                      
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(task.id)}
                          className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors rounded-full h-8 w-8"
                        >
                          <Trash2Icon className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">{task.title}</h3>
                    
                    {task.description && (
                      <p className="text-gray-600 mb-4">{task.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 rounded-full text-xs font-medium text-gray-600">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 rounded-full text-xs font-medium text-gray-600">
                        <ClockIcon className="h-3.5 w-3.5" />
                        <span>Added: {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}</span>
                      </div>
                      
                      {task.isOutdoor && taskWeather && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/50 rounded-full text-xs font-medium text-blue-600">
                          {getWeatherIconComponent(taskWeather.icon)}
                          <span>{taskWeather.temp}°F, {taskWeather.description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}

// Helper function to determine weather icon component
function getWeatherIconComponent(iconCode: string) {
  // Map OpenWeatherMap icon codes to Lucide react components
  switch(iconCode) {
    case '01d':
    case '01n':
      return <SunIcon className="h-3.5 w-3.5" />;
    case '02d':
    case '02n':
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return <CloudIcon className="h-3.5 w-3.5" />;
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return <CloudIcon className="h-3.5 w-3.5" />;
    case '11d':
    case '11n':
      return <CloudLightningIcon className="h-3.5 w-3.5" />;
    default:
      return <SunIcon className="h-3.5 w-3.5" />;
  }
}

// Helper function to determine weather icon
function getWeatherIcon(iconCode: string): string {
  // Map OpenWeatherMap icon codes to Font Awesome icons
  const iconMap: Record<string, string> = {
    '01d': 'sun',            // clear sky day
    '01n': 'moon',           // clear sky night
    '02d': 'cloud-sun',      // few clouds day
    '02n': 'cloud-moon',     // few clouds night
    '03d': 'cloud',          // scattered clouds
    '03n': 'cloud',
    '04d': 'cloud',          // broken clouds
    '04n': 'cloud',
    '09d': 'cloud-showers-heavy', // shower rain
    '09n': 'cloud-showers-heavy',
    '10d': 'cloud-sun-rain',  // rain day
    '10n': 'cloud-moon-rain', // rain night
    '11d': 'bolt',           // thunderstorm
    '11n': 'bolt',
    '13d': 'snowflake',      // snow
    '13n': 'snowflake',
    '50d': 'smog',           // mist
    '50n': 'smog'
  };

  return iconMap[iconCode] || 'sun'; // Default to sun if icon not found
}
