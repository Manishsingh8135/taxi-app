import { Vehicle } from './vehicle';

export enum DriverStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  SUSPENDED = 'SUSPENDED',
  BLOCKED = 'BLOCKED',
}

export enum OnlineStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  ON_RIDE = 'ON_RIDE',
}

export enum DocumentType {
  DRIVING_LICENSE = 'DRIVING_LICENSE',
  VEHICLE_RC = 'VEHICLE_RC',
  INSURANCE = 'INSURANCE',
  PERMIT = 'PERMIT',
  PAN_CARD = 'PAN_CARD',
  AADHAAR = 'AADHAAR',
  POLICE_VERIFICATION = 'POLICE_VERIFICATION',
}

export enum DocumentStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface Document {
  id: string;
  driverId: string;
  type: DocumentType;
  documentNumber?: string;
  frontImage: string;
  backImage?: string;
  status: DocumentStatus;
  rejectionReason?: string;
  expiryDate?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface Driver {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: DriverStatus;
  onlineStatus: OnlineStatus;
  isApproved: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  rating: number;
  totalRides: number;
  acceptanceRate: number;
  cancellationRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface DriverProfile extends Driver {
  vehicle?: Vehicle;
  documents?: Document[];
  earnings?: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    pending: number;
  };
}

export interface DriverLocation {
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number;
  speed?: number;
  updatedAt: string;
}

export interface BankAccount {
  id: string;
  driverId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  upiId?: string;
  isVerified: boolean;
}
