import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class SocketService {
  private server!: Server;
  private logger = new Logger('SocketService');
  private clientDriverMap = new Map<string, string>();
  private driverClientMap = new Map<string, string>();

  constructor(private redisService: RedisService) {}

  setServer(server: Server) {
    this.server = server;
  }

  registerDriver(clientId: string, driverId: string) {
    this.clientDriverMap.set(clientId, driverId);
    this.driverClientMap.set(driverId, clientId);
  }

  handleDisconnect(clientId: string) {
    const driverId = this.clientDriverMap.get(clientId);
    if (driverId) {
      this.clientDriverMap.delete(clientId);
      this.driverClientMap.delete(driverId);
    }
  }

  async updateDriverLocation(
    clientId: string,
    data: {
      latitude: number;
      longitude: number;
      heading?: number;
      speed?: number;
    },
  ) {
    const driverId = this.clientDriverMap.get(clientId);
    if (!driverId) return;

    await this.redisService.hset(
      `driver:location:${driverId}`,
      'data',
      JSON.stringify({
        ...data,
        updatedAt: new Date().toISOString(),
      }),
    );
    await this.redisService.expire(`driver:location:${driverId}`, 300);

    await this.redisService.geoAdd(
      'drivers:available',
      data.longitude,
      data.latitude,
      driverId,
    );
  }

  handleDriverRideResponse(
    clientId: string,
    data: { rideId: string; accepted: boolean },
  ) {
    this.logger.log(`Driver response for ride ${data.rideId}: ${data.accepted}`);
  }

  emitToRide(rideId: string, event: string, data: unknown) {
    this.server.to(`ride:${rideId}`).emit(event, data);
  }

  emitToDriver(driverId: string, event: string, data: unknown) {
    const clientId = this.driverClientMap.get(driverId);
    if (clientId) {
      this.server.to(clientId).emit(event, data);
    }
  }

  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }
}
