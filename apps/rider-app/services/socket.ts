import { io, Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';

const WS_URL = process.env.EXPO_PUBLIC_WS_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  async connect() {
    const token = await SecureStore.getItemAsync('accessToken');
    
    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToRide(rideId: string) {
    if (this.socket) {
      this.socket.emit('ride:subscribe', { rideId });
    }
  }

  unsubscribeFromRide(rideId: string) {
    if (this.socket) {
      this.socket.emit('ride:unsubscribe', { rideId });
    }
  }

  onDriverAssigned(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ride:driver_assigned', callback);
    }
  }

  onDriverLocation(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ride:driver_location', callback);
    }
  }

  onRideStatusUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ride:status_update', callback);
    }
  }

  onRideCancelled(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('ride:cancelled', callback);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();
export default socketService;
