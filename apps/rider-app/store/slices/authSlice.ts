import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

interface User {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  email?: string;
  profilePhoto?: string;
  rating: number;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  const accessToken = await SecureStore.getItemAsync('accessToken');
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  const userJson = await SecureStore.getItemAsync('user');
  
  if (accessToken && userJson) {
    return {
      accessToken,
      refreshToken,
      user: JSON.parse(userJson),
    };
  }
  return null;
});

export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/send-otp', { phone, type: 'user' });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async ({ otpId, otp }: { otpId: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/verify-otp', { otpId, otp });
      const { accessToken, refreshToken, user } = response.data.data;
      
      await SecureStore.setItemAsync('accessToken', accessToken);
      await SecureStore.setItemAsync('refreshToken', refreshToken);
      await SecureStore.setItemAsync('user', JSON.stringify(user));
      
      return { accessToken, refreshToken, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Invalid OTP');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('refreshToken');
  await SecureStore.deleteItemAsync('user');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.accessToken = action.payload.accessToken;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
          state.isAuthenticated = true;
        }
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
