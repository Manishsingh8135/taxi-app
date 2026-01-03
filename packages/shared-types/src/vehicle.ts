export enum VehicleType {
  MINI = 'MINI',
  SEDAN = 'SEDAN',
  XL = 'XL',
  PREMIUM = 'PREMIUM',
  AUTO = 'AUTO',
  BIKE = 'BIKE',
}

export interface Vehicle {
  id: string;
  driverId: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  seats: number;
  isActive: boolean;
  isVerified: boolean;
  frontPhoto?: string;
  backPhoto?: string;
  sidePhoto?: string;
  interiorPhoto?: string;
}

export interface VehicleTypeInfo {
  type: VehicleType;
  displayName: string;
  description: string;
  capacity: number;
  icon: string;
}

export const VEHICLE_TYPE_INFO: Record<VehicleType, VehicleTypeInfo> = {
  [VehicleType.MINI]: {
    type: VehicleType.MINI,
    displayName: 'TaxiGo Mini',
    description: 'Affordable, compact rides',
    capacity: 4,
    icon: 'car-compact',
  },
  [VehicleType.SEDAN]: {
    type: VehicleType.SEDAN,
    displayName: 'TaxiGo Sedan',
    description: 'Comfortable sedans',
    capacity: 4,
    icon: 'car-side',
  },
  [VehicleType.XL]: {
    type: VehicleType.XL,
    displayName: 'TaxiGo XL',
    description: 'Extra space for groups',
    capacity: 6,
    icon: 'car-suv',
  },
  [VehicleType.PREMIUM]: {
    type: VehicleType.PREMIUM,
    displayName: 'TaxiGo Premium',
    description: 'Luxury rides',
    capacity: 4,
    icon: 'car-luxury',
  },
  [VehicleType.AUTO]: {
    type: VehicleType.AUTO,
    displayName: 'TaxiGo Auto',
    description: 'Quick auto rides',
    capacity: 3,
    icon: 'rickshaw',
  },
  [VehicleType.BIKE]: {
    type: VehicleType.BIKE,
    displayName: 'TaxiGo Bike',
    description: 'Fast bike rides',
    capacity: 1,
    icon: 'motorcycle',
  },
};
