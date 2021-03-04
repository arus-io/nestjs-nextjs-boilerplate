import { Test } from '@nestjs/testing';

import { InfraModule } from '../infra.module';
import { RedisService } from './redis.service';

describe('#Redis', () => {
  let service: RedisService;

  afterAll(async () => {
    await service.quit();
  });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [InfraModule],
    }).compile();
    service = moduleRef.get(RedisService);
  });

  it(`should get and set values`, async () => {
    const res = await service.set('hola', 'mundo', 60 * 60);
    expect(res).toBe('OK');
    const res2 = await service.get('hola');
    expect(res2).toBe('mundo');
  });
});
