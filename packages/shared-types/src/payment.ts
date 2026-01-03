export enum PaymentType {
  CASH = 'CASH',
  CARD = 'CARD',
  WALLET = 'WALLET',
  UPI = 'UPI',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethodType {
  CARD = 'CARD',
  UPI = 'UPI',
  NETBANKING = 'NETBANKING',
}

export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  isDefault: boolean;
  cardLast4?: string;
  cardBrand?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  upiId?: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  referenceType?: string;
  referenceId?: string;
  description: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  rideId: string;
  amount: number;
  currency: string;
  method: PaymentType;
  status: PaymentStatus;
  gatewayId?: string;
  refundAmount?: number;
  refundReason?: string;
  createdAt: string;
  processedAt?: string;
}

export interface Earning {
  id: string;
  driverId: string;
  rideId: string;
  rideFare: number;
  platformFee: number;
  taxes: number;
  tip: number;
  incentiveBonus: number;
  netEarning: number;
  paymentMethod: PaymentType;
  isCashCollected: boolean;
  createdAt: string;
}

export interface Payout {
  id: string;
  driverId: string;
  amount: number;
  cashAdjustment: number;
  netAmount: number;
  status: PayoutStatus;
  bankName: string;
  accountNumber: string;
  processedAt?: string;
  failureReason?: string;
  createdAt: string;
}
