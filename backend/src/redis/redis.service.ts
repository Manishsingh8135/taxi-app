import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis | null = null;
  private readonly logger = new Logger(RedisService.name);
  private isConnected = false;

  constructor(private configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL');
    
    // Only connect if REDIS_URL is explicitly set
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn('Redis connection failed, running without Redis');
            return null; // Stop retrying
          }
          return Math.min(times * 100, 3000);
        },
        lazyConnect: true,
      });

      this.redis.on('connect', () => {
        this.isConnected = true;
        this.logger.log('Redis connected');
      });

      this.redis.on('error', (err) => {
        this.isConnected = false;
        // Suppress repeated error logs
      });

      // Try to connect
      this.redis.connect().catch(() => {
        this.logger.warn('Redis not available, features requiring Redis will be disabled');
      });
    } else {
      this.logger.log('Redis URL not configured, running without Redis');
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }

  getClient(): Redis | null {
    return this.redis;
  }

  private checkConnection(): boolean {
    if (!this.redis || !this.isConnected) {
      return false;
    }
    return true;
  }

  async get(key: string): Promise<string | null> {
    if (!this.checkConnection()) return null;
    return this.redis!.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.checkConnection()) return;
    if (ttl) {
      await this.redis!.set(key, value, 'EX', ttl);
    } else {
      await this.redis!.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.del(key);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    if (!this.checkConnection()) return null;
    return this.redis!.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    if (!this.checkConnection()) return {};
    return this.redis!.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.hdel(key, field);
  }

  async expire(key: string, seconds: number): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.expire(key, seconds);
  }

  async geoAdd(key: string, longitude: number, latitude: number, member: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.geoadd(key, longitude, latitude, member);
  }

  async geoRadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'km' | 'm' = 'km',
  ): Promise<string[]> {
    if (!this.checkConnection()) return [];
    return this.redis!.georadius(key, longitude, latitude, radius, unit) as Promise<string[]>;
  }

  async geoRadiusWithDist(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'km' | 'm' = 'km',
  ): Promise<[string, string][]> {
    if (!this.checkConnection()) return [];
    return this.redis!.georadius(key, longitude, latitude, radius, unit, 'WITHDIST') as Promise<
      [string, string][]
    >;
  }

  async geoRemove(key: string, member: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.zrem(key, member);
  }

  async publish(channel: string, message: string): Promise<void> {
    if (!this.checkConnection()) return;
    await this.redis!.publish(channel, message);
  }
}
