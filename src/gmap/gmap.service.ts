import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { GmapDTO, GmapResourceDTO } from 'src/dto/gmap.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Cache } from 'cache-manager';

@Injectable()
export class GmapService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  async calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
    unit: string,
  ): Promise<number> {
    if (lat1 == lat2 && lng1 == lng2) {
      return 0;
    } else {
      const radlat1: number = (Math.PI * lat1) / 180;
      const radlat2: number = (Math.PI * lat2) / 180;
      const theta: number = lng1 - lng2;
      const radtheta: number = (Math.PI * theta) / 180;
      let dist: number =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  async getListPlace(
    name: string,
    lat: number,
    lng: number,
  ): Promise<GmapDTO[]> {
    let cacheData: GmapResourceDTO[] = await this.cacheService.get(
      name.toString(),
    );
    if (!cacheData) {
      // fetch data from google api
      const { data } = await firstValueFrom(
        this.httpService
          .get('https://maps.googleapis.com/maps/api/place/textsearch/json?', {
            params: {
              types: 'restaurant',
              query: name,
              key: process.env.GMAP_KEY,
            },
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );
      await this.cacheService.set(name.toString(), data.results, 1800);
      cacheData = data.results;
    }

    // prepare list of objects
    const listPlace: GmapDTO[] = [];
    for await (const place of cacheData) {
      const _tempListPlace: GmapDTO = {
        name: place.name,
        icon: place.icon,
        icon_background_color: place.icon_background_color,
        business_status: place.business_status,
        distance: await this.calculateDistance(
          lat,
          lng,
          place.geometry.location.lat,
          place.geometry.location.lng,
          'K',
        ),
        rating: place.rating,
        img: place.photos[0].photo_reference
          ? `${process.env.APP_URL}/gmap/placephoto/${place.photos[0].photo_reference}`
          : `${process.env.APP_URL}/gray.png`,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
      };
      // append infomation
      listPlace.push(_tempListPlace);
    }
    return listPlace;
  }

  async getImgPlace(ref: string): Promise<Buffer> {
    let cache: Buffer = await this.cacheService.get(ref.toString());
    if (!cache) {
      const { data } = await firstValueFrom(
        this.httpService
          .get('https://maps.googleapis.com/maps/api/place/photo?', {
            params: {
              sensor: false,
              maxheight: 400,
              maxwidth: 500,
              photoreference: ref,
              key: process.env.GMAP_KEY,
            },
            responseType: 'arraybuffer',
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.log(error);
              throw 'An error happened!';
            }),
          ),
      );
      await this.cacheService.set(ref.toString(), data, 1800);
      cache = data;
    }
    return cache;
  }
}
