import { Test, TestingModule } from '@nestjs/testing';
import { GmapController } from './gmap.controller';

describe('GmapController', () => {
  let controller: GmapController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmapController],
    }).compile();

    controller = module.get<GmapController>(GmapController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
