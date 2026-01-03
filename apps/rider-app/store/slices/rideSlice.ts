import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/services/api';

interface Location {
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePhoto?: string;
  rating: number;
  vehicle: {
    make: string;
    model: string;
    color: string;
    licensePlate: string;
  };
}

interface Ride {
  id: string;
  rideNumber: string;
  status: string;
  pickup: Location;
  drop: Location;
  driver?: Driver;
  vehicleType: string;
  estimatedFare: number;
  estimatedDuration: number;
  rideOtp?: string;
}

interface FareEstimate {
  vehicleType: string;
  displayName: string;
  estimatedFare: { min: number; max: number };
  eta: number;
  available: boolean;
}

interface RideState {
  pickup: Location | null;
  drop: Location | null;
  fareEstimates: FareEstimate[];
  selectedVehicleType: string | null;
  activeRide: Ride | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: RideState = {
  pickup: null,
  drop: null,
  fareEstimates: [],
  selectedVehicleType: null,
  activeRide: null,
  isLoading: false,
  error: null,
};

export const getFareEstimates = createAsyncThunk(
  'ride/getFareEstimates',
  async (
    { pickup, drop, distance, duration }: { pickup: Location; drop: Location; distance: number; duration: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/rides/estimate', { pickup, drop, distance, duration });
      return response.data.data.estimates;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to get estimates');
    }
  }
);

export const bookRide = createAsyncThunk(
  'ride/bookRide',
  async (
    data: {
      pickup: Location;
      drop: Location;
      vehicleType: string;
      paymentMethod: string;
      estimatedDistance: number;
      estimatedDuration: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/rides', data);
      return response.data.data.ride;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to book ride');
    }
  }
);

export const cancelRide = createAsyncThunk(
  'ride/cancelRide',
  async ({ rideId, reason }: { rideId: string; reason?: string }, { rejectWithValue }) => {
    try {
      await api.patch(`/rides/${rideId}/cancel`, { reason });
      return rideId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error?.message || 'Failed to cancel ride');
    }
  }
);

const rideSlice = createSlice({
  name: 'ride',
  initialState,
  reducers: {
    setPickup: (state, action: PayloadAction<Location>) => {
      state.pickup = action.payload;
    },
    setDrop: (state, action: PayloadAction<Location>) => {
      state.drop = action.payload;
    },
    setSelectedVehicleType: (state, action: PayloadAction<string>) => {
      state.selectedVehicleType = action.payload;
    },
    updateActiveRide: (state, action: PayloadAction<Partial<Ride>>) => {
      if (state.activeRide) {
        state.activeRide = { ...state.activeRide, ...action.payload };
      }
    },
    setDriverAssigned: (state, action: PayloadAction<{ driver: Driver; rideOtp: string }>) => {
      if (state.activeRide) {
        state.activeRide.driver = action.payload.driver;
        state.activeRide.rideOtp = action.payload.rideOtp;
        state.activeRide.status = 'ACCEPTED';
      }
    },
    clearRide: (state) => {
      state.pickup = null;
      state.drop = null;
      state.fareEstimates = [];
      state.selectedVehicleType = null;
      state.activeRide = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFareEstimates.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFareEstimates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fareEstimates = action.payload;
      })
      .addCase(getFareEstimates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(bookRide.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeRide = action.payload;
      })
      .addCase(bookRide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(cancelRide.fulfilled, (state) => {
        state.activeRide = null;
      });
  },
});

export const {
  setPickup,
  setDrop,
  setSelectedVehicleType,
  updateActiveRide,
  setDriverAssigned,
  clearRide,
} = rideSlice.actions;
export default rideSlice.reducer;
