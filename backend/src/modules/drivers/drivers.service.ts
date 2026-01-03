import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class DriversService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getProfile(driverId: string) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        vehicle: true,
        documents: true,
        bankAccount: true,
      },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return { success: true, data: driver };
  }

  async updateProfile(driverId: string, dto: UpdateDriverDto) {
    const driver = await this.prisma.driver.update({
      where: { id: driverId },
      data: dto,
    });

    return { success: true, data: driver };
  }

  async goOnline(driverId: string, location: UpdateLocationDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.status !== 'APPROVED') {
      throw new BadRequestException('Driver not approved');
    }

    await this.prisma.driver.update({
      where: { id: driverId },
      data: {
        onlineStatus: 'ONLINE',
        currentLatitude: location.latitude,
        currentLongitude: location.longitude,
        lastOnlineAt: new Date(),
      },
    });

    await this.redis.geoAdd(
      'drivers:available',
      location.longitude,
      location.latitude,
      driverId,
    );

    return {
      success: true,
      data: {
        status: 'ONLINE',
        message: 'You are now online and receiving ride requests',
      },
    };
  }

  async goOffline(driverId: string) {
    await this.prisma.driver.update({
      where: { id: driverId },
      data: { onlineStatus: 'OFFLINE' },
    });

    await this.redis.geoRemove('drivers:available', driverId);

    return {
      success: true,
      data: {
        status: 'OFFLINE',
        message: 'You are now offline',
      },
    };
  }

  async updateLocation(driverId: string, location: UpdateLocationDto) {
    await this.prisma.driver.update({
      where: { id: driverId },
      data: {
        currentLatitude: location.latitude,
        currentLongitude: location.longitude,
        lastLocationAt: new Date(),
      },
    });

    await this.redis.hset(
      `driver:location:${driverId}`,
      'data',
      JSON.stringify({
        ...location,
        updatedAt: new Date().toISOString(),
      }),
    );
    await this.redis.expire(`driver:location:${driverId}`, 300);

    await this.redis.geoAdd(
      'drivers:available',
      location.longitude,
      location.latitude,
      driverId,
    );

    return { success: true };
  }

  async getEarnings(driverId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const earnings = await this.prisma.earning.aggregate({
      where: {
        driverId,
        createdAt: { gte: today },
      },
      _sum: { netEarning: true },
      _count: true,
    });

    return {
      success: true,
      data: {
        today: earnings._sum.netEarning || 0,
        trips: earnings._count,
      },
    };
  }

  async findNearbyDrivers(lat: number, lng: number, radiusKm: number = 5) {
    const driverIds = await this.redis.geoRadius(
      'drivers:available',
      lng,
      lat,
      radiusKm,
      'km',
    );
    return driverIds;
  }
}
