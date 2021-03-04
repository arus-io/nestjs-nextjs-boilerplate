import { Module, OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from './logger/logger.module';
import { RedisService } from './cache/redis.service';

@Module({
  imports: [LoggerModule, ConfigModule, ConfigService],
  providers: [RedisService],
  exports: [RedisService, ConfigService],
})
export class InfraModule implements OnModuleDestroy {
  constructor(private service: RedisService) {}
  async onModuleDestroy() {
    return this.service.quit();
  }
}
