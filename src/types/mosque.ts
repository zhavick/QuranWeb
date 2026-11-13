export type MosqueFacilityId =
  | 'ground_wudhu'
  | 'prayer_chairs'
  | 'wheelchair_ramp'
  | 'ac'
  | 'parking'
  | 'clean_toilet';

export interface MosqueFacility {
  id: MosqueFacilityId;
  label: string;
  description: string;
}

export interface MosqueItem {
  id: string;
  name: string;
  arabicName?: string;
  address: string;
  city: string;
  province?: string;
  lat: number;
  lng: number;
  distanceMeters?: number;
  elderWalkMinutes?: number;
  facilities: MosqueFacilityId[];
  isVerified?: boolean;
  phone?: string;
  googlePlaceId?: string;
}

export interface NearbyMosquesFilter {
  searchQuery?: string;
  maxDistanceKm?: number;
  facilityRequired?: MosqueFacilityId | 'ALL';
}

