const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || "69d14eb5e6ba33bcc30c3c632ecab971";

export interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  };
  location: string;
  forecast: {
    date: string;
    temp: number;
    weather: {
      main: string;
      icon: string;
    };
  }[];
}

export async function fetchWeatherData(location: string = "New York"): Promise<WeatherData> {
  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=imperial`
    );
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API error: ${currentResponse.statusText}`);
    }
    
    const currentData = await currentResponse.json();
    
    // 5-day forecast (will extract 3 days for our widget)
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=imperial`
    );
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process forecast data to get next 3 days (one forecast per day)
    const processedForecast = processForecastData(forecastData.list);
    
    return {
      current: {
        temp: Math.round(currentData.main.temp),
        humidity: currentData.main.humidity,
        wind_speed: Math.round(currentData.wind.speed),
        weather: currentData.weather.map((w: any) => ({
          main: w.main,
          description: w.description,
          icon: w.icon
        }))
      },
      location: currentData.name,
      forecast: processedForecast
    };
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

// Helper to extract one forecast per day
function processForecastData(forecastList: any[]): any[] {
  const dailyForecasts = new Map();
  
  forecastList.forEach((item: any) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toISOString().split('T')[0];
    
    if (!dailyForecasts.has(dayKey)) {
      dailyForecasts.set(dayKey, {
        date: dayKey,
        temp: Math.round(item.main.temp),
        weather: {
          main: item.weather[0].main,
          icon: item.weather[0].icon
        }
      });
    }
  });
  
  // Get only the next 3 days
  return Array.from(dailyForecasts.values()).slice(1, 4);
}

// Get weather icon URL
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Function to get appropriate weather icon from Font Awesome
export function getWeatherIcon(iconCode: string): string {
  // Map OpenWeatherMap icon codes to Font Awesome icons
  const iconMap: Record<string, string> = {
    '01d': 'fa-sun',            // clear sky day
    '01n': 'fa-moon',           // clear sky night
    '02d': 'fa-cloud-sun',      // few clouds day
    '02n': 'fa-cloud-moon',     // few clouds night
    '03d': 'fa-cloud',          // scattered clouds
    '03n': 'fa-cloud',
    '04d': 'fa-cloud',          // broken clouds
    '04n': 'fa-cloud',
    '09d': 'fa-cloud-showers-heavy', // shower rain
    '09n': 'fa-cloud-showers-heavy',
    '10d': 'fa-cloud-sun-rain',  // rain day
    '10n': 'fa-cloud-moon-rain', // rain night
    '11d': 'fa-bolt',           // thunderstorm
    '11n': 'fa-bolt',
    '13d': 'fa-snowflake',      // snow
    '13n': 'fa-snowflake',
    '50d': 'fa-smog',           // mist
    '50n': 'fa-smog'
  };

  return iconMap[iconCode] || 'fa-sun'; // Default to sun if icon not found
}
