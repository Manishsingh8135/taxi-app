import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { SocketService } from '../../socket/socket.service';
import { DriversService } from '../drivers/drivers.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { FareEstimateDto } from './dto/fare-estimate.dto';

@Injectable()
export class RidesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private socket: SocketService,
    private driversService: DriversService,
  ) {}

  async getFareEstimate(dto: FareEstimateDto) {
    const fareConfigs = await this.prisma.fareConfig.findMany({
      where: { isActive: true },
    });

    const estimates = fareConfigs.map((config) => {
      const distanceFare = dto.distance * config.perKmRate;
      const timeFare = dto.duration * config.perMinuteRate;
      const totalFare = config.baseFare + distanceFare + timeFare;
      const minFare = Math.max(totalFare * 0.9, config.minimumFare);
      const maxFare = totalFare * 1.1;

      return {
        vehicleType: config.vehicleType,
        estimatedFare: { min: Math.round(minFare), max: Math.round(maxFare), currency: 'INR' },
        estimatedDuration: dto.duration,
        estimatedDistance: dto.distance,
        eta: 5,
        surgeMultiplier: 1.0,
        available: true,
      };
    });

    return { success: true, data: { estimates } };
  }

  async createRide(userId: string, dto: CreateRideDto) {
    const rideNumber = `TG-${Date.now().toString(36).toUpperCase()}`;
    const rideOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const fareConfig = await this.prisma.fareConfig.findFirst({
      where: { vehicleType: dto.vehicleType, isActive: true },
    });

    if (!fareConfig) {
      throw new BadRequestException('Vehicle type not available');
    }

    const baseFare = fareConfig.baseFare;
    const distanceFare = dto.estimatedDistance * fareConfig.perKmRate;
    const timeFare = dto.estimatedDuration * fareConfig.perMinuteRate;
    const taxes = (baseFare + distanceFare + timeFare) * 0.05;
    const totalFare = baseFare + distanceFare + timeFare + taxes;

    const ride = await this.prisma.ride.create({
      data: {
        rideNumber,
        userId,
        vehicleType: dto.vehicleType,
        pickupAddress: dto.pickup.address,
        pickupLatitude: dto.pickup.latitude,
        pickupLongitude: dto.pickup.longitude,
        dropAddress: dto.drop.address,
        dropLatitude: dto.drop.latitude,
        dropLongitude: dto.drop.longitude,
        estimatedDistance: dto.estimatedDistance,
        estimatedDuration: dto.estimatedDuration,
        baseFare,
        distanceFare,
        timeFare,
        taxes,
        totalFare,
        paymentMethod: dto.paymentMethod,
        rideOtp,
        status: 'SEARCHING',
      },
    });

    this.findAndAssignDriver(ride.id, dto.pickup.latitude, dto.pickup.longitude);

    return { success: true, data: { ride } };
  }

  private async findAndAssignDriver(rideId: string, lat: number, lng: number) {
    const nearbyDriverIds = await this.driversService.findNearbyDrivers(lat, lng, 5);

    for (const driverId of nearbyDriverIds) {
      const driver = await this.prisma.driver.findUnique({
        where: { id: driverId },
        include: { vehicle: true },
      });

      if (driver && driver.onlineStatus === 'ONLINE' && !driver.currentRideId) {
        const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
        if (!ride || ride.status !== 'SEARCHING') return;

        this.socket.emitToDriver(driverId, 'ride:new_request', {
          rideId,
          pickup: { address: ride.pickupAddress, latitude: ride.pickupLatitude, longitude: ride.pickupLongitude },
          drop: { address: ride.dropAddress, latitude: ride.dropLatitude, longitude: ride.dropLongitude },
          estimatedFare: ride.totalFare,
          vehicleType: ride.vehicleType,
          expiresIn: 15,
        });

        await new Promise((resolve) => setTimeout(resolve, 15000));

        const updatedRide = await this.prisma.ride.findUnique({ where: { id: rideId } });
        if (updatedRide?.driverId) return;
      }
    }
  }

  async getActiveRide(userId: string) {
    const ride = await this.prisma.ride.findFirst({
      where: {
        userId,
        status: { in: ['SEARCHING', 'ACCEPTED', 'ARRIVING', 'ARRIVED', 'IN_PROGRESS'] },
      },
      include: { driver: { include: { vehicle: true } } },
    });

    return { success: true, data: ride };
  }

  async getRide(rideId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
      include: { driver: { include: { vehicle: true } }, user: true },
    });

    if (!ride) throw new NotFoundException('Ride not found');
    return { success: true, data: ride };
  }

  async cancelRide(rideId: string, cancelledById: string, cancelledBy: 'USER' | 'DRIVER', reason?: string) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');

    if (!['SEARCHING', 'ACCEPTED', 'ARRIVING', 'ARRIVED'].includes(ride.status)) {
      throw new BadRequestException('Cannot cancel ride at this stage');
    }

    await this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'CANCELLED',
        cancelledBy,
        cancellationReason: reason,
        cancelledAt: new Date(),
      },
    });

    this.socket.emitToRide(rideId, 'ride:cancelled', { rideId, cancelledBy, reason });

    return { success: true, message: 'Ride cancelled successfully' };
  }

  async rateRide(rideId: string, reviewerId: string, reviewerType: 'USER' | 'DRIVER', data: { rating: number; comment?: string; tags?: string[] }) {
    const ride = await this.prisma.ride.findUnique({ where: { id: rideId } });
    if (!ride) throw new NotFoundException('Ride not found');
    if (ride.status !== 'COMPLETED') throw new BadRequestException('Can only rate completed rides');

    const revieweeId = reviewerType === 'USER' ? ride.driverId : ride.userId;
    if (!revieweeId) throw new BadRequestException('No reviewee found');

    await this.prisma.review.create({
      data: {
        rideId,
        reviewerType,
        reviewerId,
        revieweeId,
        rating: data.rating,
        comment: data.comment,
        tags: data.tags || [],
      },
    });

    return { success: true, message: 'Rating submitted' };
  }

  async getRideHistory(userId: string) {
    const rides = await this.prisma.ride.findMany({
      where: { userId },
      orderBy: { requestedAt: 'desc' },
      take: 20,
      include: { driver: true },
    });

    return { success: true, data: rides };
  }
}
