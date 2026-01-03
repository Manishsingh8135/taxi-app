import { VehicleType } from './vehicle';
import { PaymentType, PaymentStatus } from './payment';

export enum RideStatus {
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  ARRIVING = 'ARRIVING',
  ARRIVED = 'ARRIVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum CancelledBy {
  USER = 'USER',
  DRIVER = 'DRIVER',
  SYSTEM = 'SYSTEM',
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface RideStop {
  id: string;
  rideId: string;
  address: string;
  latitude: number;
  longitude: number;
  stopOrder: number;
  arrivedAt?: string;
  departedAt?: string;
  waitTime: number;
}

export interface Ride {
  id: string;
  rideNumber: string;
  userId: string;
  driverId?: string;
  vehicleType: VehicleType;
  pickup: Location;
  drop: Location;
  stops?: RideStop[];
  estimatedDistance: number;
  estimatedDuration: number;
  actualDistance?: number;
  actualDuration?: number;
  routePolyline?: string;
  status: RideStatus;
  rideOtp?: string;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  waitTimeFare: number;
  tollCharges: number;
  surgeMultiplier: number;
  taxes: number;
  tip: number;
  discount: number;
  totalFare: number;
  promoCode?: string;
  promoDiscount: number;
  paymentMethod: PaymentType;
  paymentStatus: PaymentStatus;
  isScheduled: boolean;
  scheduledAt?: string;
  requestedAt: string;
  acceptedAt?: string;
  arrivedAt?: string;
  startedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelledBy?: CancelledBy;
  cancellationReason?: string;
  cancellationFee: number;
}

export interface FareEstimate {
  vehicleType: VehicleType;
  displayName: string;
  description: string;
  capacity: number;
  estimatedFare: {
    min: number;
    max: number;
    currency: string;
  };
  estimatedDuration: number;
  estimatedDistance: number;
  eta: number;
  surgeMultiplier: number;
  available: boolean;
}

export interface RideRequest {
  pickup: Location;
  drop: Location;
  vehicleType: VehicleType;
  paymentMethod: PaymentType;
  paymentMethodId?: string;
  promoCode?: string;
  scheduledAt?: string;
}

export interface DriverRideRequest {
  rideId: string;
  pickup: Location & { distance: number };
  drop: Location;
  estimatedFare: number;
  estimatedDistance: number;
  estimatedDuration: number;
  vehicleType: VehicleType;
  surgeMultiplier: number;
  user: {
    firstName: string;
    rating: number;
  };
  expiresIn: number;
}

export interface Review {
  id: string;
  rideId: string;
  reviewerType: 'USER' | 'DRIVER';
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  tags: string[];
  createdAt: string;
}
