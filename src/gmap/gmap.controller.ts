import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseMsg } from 'src/dto/gmap.dto';
import { GmapService } from './gmap.service';
@Controller('gmap')
export class GmapController {
  constructor(private gmapService: GmapService) {}

  @HttpCode(200)
  @Post('searchbyname')
  async searchNearbyByName(@Req() request: Request): Promise<ResponseMsg> {
    try {
      const { name, latitude, longitude } = request.body;
      const data = await this.gmapService.getListPlace(
        name,
        latitude,
        longitude,
      );
      const responseObj: ResponseMsg = {
        responseCode: 200,
        responseMsg: 'success',
        data: data,
      };
      return responseObj;
    } catch (error) {
      const responseObj: ResponseMsg = {
        responseCode: 500,
        responseMsg: error.message,
        data: [],
      };
      return responseObj;
    }
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
