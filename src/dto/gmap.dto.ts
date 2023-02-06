export interface GmapDTO {
  name: string;
  icon: string;
  icon_background_color: string;
  business_status: string;
  distance: number;
  rating: number;
  img: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ResponseMsg {
  responseCode: number;
  responseMsg: string;
  data: GmapDTO[];
}

export interface GmapResourceDTO {
  business_status: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    viewport: {
      northeast: {
        lat: number;
        lng: number;
      };
      southwest: {
        lat: number;
        lng: number;
      };
    };
  };
  icon: string;
  icon_background_color: string;
  icon_mask_base_uri: string;
  name: string;
  opening_hours: {
    open_now: boolean;
  };
  photos: [
    {
      height: number;
      html_attributions: string[];
      photo_reference: string;
      width: number;
    },
  ];
  place_id: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  rating: number;
  reference: string;
  types: string[];
  user_ratings_total: number;
}
