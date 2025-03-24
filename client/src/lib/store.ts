import { configureStore, createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Task } from '@shared/schema';
import { apiRequest } from './queryClient';
import { fetchWeatherData, WeatherData } from './weatherAPI';

// Auth Slice
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/users/login', { username, password });
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { username: string; password: string; name: string; email: string }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/users/register', userData);
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('user');
    },
    restoreAuth(state) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        state.user = JSON.parse(savedUser);
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Tasks Slice
interface TasksState {
  tasks: Task[];
  filteredTasks: Task[];
  filter: string;
  loading: boolean;
  error: string | null;
}

const initialTasksState: TasksState = {
  tasks: [],
  filteredTasks: [],
  filter: 'all',
  loading: false,
  error: null
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await apiRequest('GET', `/api/tasks?userId=${userId}`, undefined);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch tasks');
    }
  }
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task: {
    userId: number;
    title: string;
    description: string;
    priority: string;
    isOutdoor: boolean;
    dueDate?: string | null;
  }, { rejectWithValue }) => {
    try {
      const response = await apiRequest('POST', '/api/tasks', task);
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to add task');
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId: number, { rejectWithValue }) => {
    try {
      await apiRequest('DELETE', `/api/tasks/${taskId}`, undefined);
      return taskId;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to delete task');
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: initialTasksState,
  reducers: {
    filterTasks(state, action: PayloadAction<string>) {
      state.filter = action.payload;
      if (action.payload === 'all') {
        state.filteredTasks = state.tasks;
      } else {
        state.filteredTasks = state.tasks.filter(task => task.priority === action.payload);
      }
    },
    clearTasks(state) {
      state.tasks = [];
      state.filteredTasks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
        state.filteredTasks = action.payload;
        state.loading = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.filteredTasks = state.filter === 'all' 
          ? state.tasks 
          : state.tasks.filter(task => task.priority === state.filter);
        state.loading = false;
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
        state.filteredTasks = state.filter === 'all' 
          ? state.tasks 
          : state.tasks.filter(task => task.priority === state.filter);
        state.loading = false;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Weather Slice
interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

const initialWeatherState: WeatherState = {
  data: null,
  loading: false,
  error: null
};

export const getWeather = createAsyncThunk(
  'weather/getWeather',
  async (location: string = 'New Delhi', { rejectWithValue }) => {
    try {
      const data = await fetchWeatherData(location);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to fetch weather data');
    }
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState: initialWeatherState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeather.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(getWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

// Combining all slices into the store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tasks: tasksSlice.reducer,
    weather: weatherSlice.reducer
  }
});

// Exporting actions
export const { logout, restoreAuth } = authSlice.actions;
export const { filterTasks, clearTasks } = tasksSlice.actions;

// Type definitions
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
