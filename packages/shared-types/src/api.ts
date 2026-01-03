// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: PaginationMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Auth Types
export interface SendOtpRequest {
  phone: string;
  type: 'user' | 'driver';
}

export interface SendOtpResponse {
  otpId: string;
  expiresIn: number;
  isNewUser: boolean;
}

export interface VerifyOtpRequest {
  otpId: string;
  otp: string;
  deviceToken?: string;
  deviceType?: 'ios' | 'android';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse extends AuthTokens {
  user?: unknown;
  driver?: unknown;
  isNewUser: boolean;
}

// WebSocket Events
export enum SocketEvents {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',

  // Ride events (User)
  RIDE_SUBSCRIBE = 'ride:subscribe',
  RIDE_UNSUBSCRIBE = 'ride:unsubscribe',
  RIDE_DRIVER_ASSIGNED = 'ride:driver_assigned',
  RIDE_DRIVER_LOCATION = 'ride:driver_location',
  RIDE_STATUS_UPDATE = 'ride:status_update',
  RIDE_CANCELLED = 'ride:cancelled',

  // Ride events (Driver)
  RIDE_NEW_REQUEST = 'ride:new_request',
  RIDE_REQUEST_EXPIRED = 'ride:request_expired',
  DRIVER_RIDE_RESPONSE = 'driver:ride_response',

  // Driver events
  DRIVER_LOCATION_UPDATE = 'driver:location_update',
  DRIVER_STATUS_CHANGE = 'driver:status_change',

  // Chat
  CHAT_MESSAGE = 'chat:message',
  CHAT_TYPING = 'chat:typing',
}

// Notification Types
export enum NotificationType {
  RIDE_UPDATE = 'RIDE_UPDATE',
  PAYMENT = 'PAYMENT',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM',
  SAFETY = 'SAFETY',
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}
