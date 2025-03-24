import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, getWeather } from '@/lib/store';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { 
  SunIcon, CloudIcon, MoonIcon, CloudSunIcon, CloudMoonIcon, 
  CloudRainIcon, CloudDrizzleIcon, CloudLightningIcon, CloudSnowIcon, 
  DropletIcon, WindIcon, InfoIcon
} from 'lucide-react';

export default function WeatherWidget() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: weatherData, loading, error } = useSelector((state: RootState) => state.weather);
  
  // Fetch weather data when component mounts
  useEffect(() => {
    dispatch(getWeather('New Delhi')); // Updated to use dynamic location
  }, [dispatch]);
  
  const getWeatherIconComponent = (iconCode: string) => {
    // Map OpenWeatherMap icon codes to Lucide react components
    switch(iconCode) {
      case '01d':
        return <SunIcon className="h-10 w-10 text-amber-500" />;
      case '01n':
        return <MoonIcon className="h-10 w-10 text-indigo-400" />;
      case '02d':
        return <CloudSunIcon className="h-10 w-10 text-blue-500" />;
      case '02n':
        return <CloudMoonIcon className="h-10 w-10 text-indigo-400" />;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <CloudIcon className="h-10 w-10 text-gray-500" />;
      case '09d':
      case '09n':
        return <CloudDrizzleIcon className="h-10 w-10 text-blue-600" />;
      case '10d':
      case '10n':
        return <CloudRainIcon className="h-10 w-10 text-blue-600" />;
      case '11d':
      case '11n':
        return <CloudLightningIcon className="h-10 w-10 text-amber-600" />;
      case '13d':
      case '13n':
        return <CloudSnowIcon className="h-10 w-10 text-blue-300" />;
      case '50d':
      case '50n':
        return <CloudIcon className="h-10 w-10 text-gray-400" />;
      default:
        return <SunIcon className="h-10 w-10 text-amber-500" />;
    }
  };
  
  const getForecastIconComponent = (iconCode: string) => {
    // Same mapping but smaller icons for forecast
    switch(iconCode) {
      case '01d':
        return <SunIcon className="h-6 w-6 text-amber-500" />;
      case '01n':
        return <MoonIcon className="h-6 w-6 text-indigo-400" />;
      case '02d':
        return <CloudSunIcon className="h-6 w-6 text-blue-500" />;
      case '02n':
        return <CloudMoonIcon className="h-6 w-6 text-indigo-400" />;
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <CloudIcon className="h-6 w-6 text-gray-500" />;
      case '09d':
      case '09n':
        return <CloudDrizzleIcon className="h-6 w-6 text-blue-600" />;
      case '10d':
      case '10n':
        return <CloudRainIcon className="h-6 w-6 text-blue-600" />;
      case '11d':
      case '11n':
        return <CloudLightningIcon className="h-6 w-6 text-amber-600" />;
      case '13d':
      case '13n':
        return <CloudSnowIcon className="h-6 w-6 text-blue-300" />;
      case '50d':
      case '50n':
        return <CloudIcon className="h-6 w-6 text-gray-400" />;
      default:
        return <SunIcon className="h-6 w-6 text-amber-500" />;
    }
  };
  
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    return format(date, 'EEE');
  };
  
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
  
  const forecastVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  if (loading) {
    return (
      <motion.div 
        className="task-container mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-7 w-48" />
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-full" />
              <div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-12 w-12 rounded-lg" />
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }
  
  if (error || !weatherData) {
    return (
      <motion.div 
        className="task-container mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-rose-500 to-red-400 flex items-center justify-center shadow-md">
            <CloudIcon className="h-5 w-5 text-white" />
          </div>
          <h2 className="gradient-text text-2xl">Weather Forecast</h2>
        </div>
        
        <Separator className="mb-6" />
        
        <div className="bg-rose-50 border border-rose-100 rounded-xl p-6 text-center">
          <CloudIcon className="h-12 w-12 text-rose-400 mx-auto mb-3" />
          <h3 className="text-rose-700 font-medium mb-2">Weather Data Unavailable</h3>
          <p className="text-rose-600 text-sm">
            {error || 'Failed to load weather data. Please try again later.'}
          </p>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="task-container mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-sky-400 flex items-center justify-center shadow-md">
          <SunIcon className="h-5 w-5 text-white" />
        </div>
        <h2 className="gradient-text text-2xl">Weather Forecast</h2>
      </motion.div>
      
      <Separator className="mb-6" />
      
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center">
            <div className="mr-4">
              {getWeatherIconComponent(weatherData.current.weather[0].icon)}
            </div>
            <div>
              <div className="text-4xl font-light text-gray-900">{weatherData.current.temp}°F</div>
              <div className="text-gray-600">{weatherData.location}</div>
            </div>
          </div>
          
          <div className="glass-effect px-4 py-2 rounded-lg text-sm">
            <div className="font-medium text-gray-900 capitalize">
              {weatherData.current.weather[0].description}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-effect rounded-lg p-3 flex items-center">
            <DropletIcon className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <div className="text-sm text-gray-600">Humidity</div>
              <div className="text-lg font-medium text-gray-900">{weatherData.current.humidity}%</div>
            </div>
          </div>
          
          <div className="glass-effect rounded-lg p-3 flex items-center">
            <WindIcon className="h-5 w-5 text-cyan-500 mr-2" />
            <div>
              <div className="text-sm text-gray-600">Wind Speed</div>
              <div className="text-lg font-medium text-gray-900">{weatherData.current.wind_speed} mph</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {weatherData.forecast && weatherData.forecast.length > 0 && (
        <motion.div variants={forecastVariants} className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">3-Day Forecast</h3>
          <div className="grid grid-cols-3 gap-2">
            {weatherData.forecast.map((day, index) => (
              <motion.div 
                key={day.date} 
                className="glass-effect rounded-lg p-3 text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-medium text-gray-700 mb-2">{getDayOfWeek(day.date)}</div>
                <div className="flex justify-center mb-2">
                  {getForecastIconComponent(day.weather.icon)}
                </div>
                <div className="text-lg font-medium text-gray-900">{day.temp}°F</div>
                <div className="text-xs text-gray-600 mt-1 capitalize">{day.weather.main}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      
      <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm text-gray-500 mt-6 pt-3 border-t border-gray-100">
        <InfoIcon className="h-4 w-4" />
        <span>Weather data for outdoor tasks is automatically updated</span>
      </motion.div>
    </motion.div>
  );
}
