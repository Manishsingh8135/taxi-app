import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly redis: Redis;

  constructor(private configService: ConfigService) {
    this.redis = new Redis(this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379');
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  getClient(): Redis {
    return this.redis;
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.set(key, value, 'EX', ttl);
    } else {
      await this.redis.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async hset(key: string, field: string, value: string): Promise<void> {
    await this.redis.hset(key, field, value);
  }

  async hget(key: string, field: string): Promise<string | null> {
    return this.redis.hget(key, field);
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    return this.redis.hgetall(key);
  }

  async hdel(key: string, field: string): Promise<void> {
    await this.redis.hdel(key, field);
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.redis.expire(key, seconds);
  }

  async geoAdd(key: string, longitude: number, latitude: number, member: string): Promise<void> {
    await this.redis.geoadd(key, longitude, latitude, member);
  }

  async geoRadius(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'km' | 'm' = 'km',
  ): Promise<string[]> {
    return this.redis.georadius(key, longitude, latitude, radius, unit) as Promise<string[]>;
  }

  async geoRadiusWithDist(
    key: string,
    longitude: number,
    latitude: number,
    radius: number,
    unit: 'km' | 'm' = 'km',
  ): Promise<[string, string][]> {
    return this.redis.georadius(key, longitude, latitude, radius, unit, 'WITHDIST') as Promise<
      [string, string][]
    >;
  }

  async geoRemove(key: string, member: string): Promise<void> {
    await this.redis.zrem(key, member);
  }

  async publish(channel: string, message: string): Promise<void> {
    await this.redis.publish(channel, message);
  }
}
