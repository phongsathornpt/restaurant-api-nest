import { Test, TestingModule } from '@nestjs/testing';
import { GmapService } from './gmap.service';

describe('GmapService', () => {
  let service: GmapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GmapService],
    }).compile();

    service = module.get<GmapService>(GmapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
