export enum UserStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName?: string;
  profilePhoto?: string;
  dateOfBirth?: string;
  gender?: Gender;
  status: UserStatus;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  rating: number;
  totalRides: number;
  referralCode: string;
  referredBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedPlace {
  id: string;
  userId: string;
  name: string;
  type: 'HOME' | 'WORK' | 'CUSTOM';
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface UserProfile extends User {
  wallet?: {
    balance: number;
    currency: string;
  };
  savedPlaces?: SavedPlace[];
}
