import { Module } from '@nestjs/common';
import { GmapController } from './gmap.controller';
import { GmapService } from './gmap.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [GmapController],
  providers: [GmapService],
  imports: [HttpModule],
})
export class GmapModule {}
