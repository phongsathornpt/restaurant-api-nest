import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { GmapDTO } from 'src/dto/gmap.dto';
import { GmapService } from './gmap.service';
@Controller('gmap')
export class GmapController {
  constructor(private gmapService: GmapService) {}

  @Post('searchbyname')
  async searchNearbyByName(@Req() request: Request): Promise<GmapDTO[]> {
    const { name, latitude, longitude } = request.body;
    return await this.gmapService.getListPlace(name, latitude, longitude);
  }

  @Get('placephoto/:ref')
  async getPlacephoto(@Param('ref') ref: string, @Res() res: Response) {
    const buff = await this.gmapService.getImgPlace(ref);
    res.set({
      'Content-Type': 'image/png',
    });
    res.send(buff);
  }
}
