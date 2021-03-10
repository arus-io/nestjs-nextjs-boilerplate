import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import redis, { RedisClient } from 'redis';
import { promisify } from 'util';

import { AppLogger } from '../logger/app.logger';

@Injectable()
export class RedisService {
  private context = 'Redis client';
  public client: RedisClient; // @TODO - make private and wrap all methods

  constructor(private logger: AppLogger, configService: ConfigService) {
    const client = redis.createClient(configService.get('REDIS_URL'));
    client.set = promisify(client.set).bind(client);
    client.get = promisify(client.get).bind(client);
    client.del = promisify(client.del).bind(client);
    client.expire = promisify(client.expire).bind(client);
    client.ttl = promisify(client.ttl).bind(client);
    client.flushall = promisify(client.flushall).bind(client);
    client.quit = promisify(client.quit).bind(client);
    this.client = client;
    this.logger.debug('Redis client created', this.context);
  }

  async quit() {
    return this.client.quit;
  }

  async getCached(conf: { key: string; expirationSec?: number; forceReFetch?: boolean }, dataFetcher) {
    const canGrabFromCache = !conf.forceReFetch;
    if (canGrabFromCache) {
      const data = await this.getIfCached(conf);
      if (data) return data;
    }
    // need to reFetch data
    const data = await dataFetcher();
    if (data !== undefined && data !== null) {
      await this.set(conf.key, JSON.stringify(data), conf.expirationSec);
      return data;
    }
  }

  async getIfCached(conf: { key: string }) {
    const cachedData = await this.get(conf.key);
    if (cachedData) {
      try {
        return JSON.parse(cachedData);
      } catch (e) {
        this.client.del(conf.key);
        console.log('error parsing cached data', cachedData);
      }
    }
  }

  async flushAll() {
    return this.client.flushall();
  }

  async set(key: string, value: string, expSeconds?: number) {
    if (expSeconds) {
      return await this.client.set(key, value, 'EX', expSeconds);
    } else {
      return await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string> {
    return this.client.get(key) as any;
  }

  async del(key: string): Promise<void> {
    return this.client.del(key) as any;
  }

  async expire(key: string, ttlSec: number): Promise<void> {
    return this.client.expire(key, ttlSec) as any;
  }
}
