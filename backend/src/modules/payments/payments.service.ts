import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getWallet(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return { success: true, data: wallet };
  }

  async getTransactions(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const transactions = await this.prisma.walletTransaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return { success: true, data: transactions };
  }

  async topUpWallet(userId: string, amount: number) {
    const wallet = await this.prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const updatedWallet = await this.prisma.wallet.update({
      where: { userId },
      data: { balance: { increment: amount } },
    });

    await this.prisma.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'CREDIT',
        amount,
        balanceBefore: wallet.balance,
        balanceAfter: updatedWallet.balance,
        description: 'Wallet top-up',
      },
    });

    return { success: true, data: updatedWallet };
  }

  async processRidePayment(rideId: string, amount: number, method: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    await this.prisma.payment.create({
      data: {
        rideId,
        amount,
        method: method as 'CASH' | 'CARD' | 'WALLET' | 'UPI',
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });

    await this.prisma.ride.update({
      where: { id: rideId },
      data: { paymentStatus: 'COMPLETED' },
    });

    return { success: true };
  }
}
