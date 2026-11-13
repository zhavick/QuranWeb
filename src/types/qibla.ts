export interface QiblaCoordinate {
  latitude: number;
  longitude: number;
}

export interface QiblaCalculationResult {
  latitude: number;
  longitude: number;
  cityName: string;
  qiblaBearing: number; // Derajat dari Utara (0 - 360)
  distanceKm: number; // Jarak ke Ka'bah dalam km
  cardinalDirection: string; // Misal: "Barat Laut (WNW)"
  compassDeviationFromNorth: number;
}

export interface RasydulQiblahEvent {
  title: string;
  gregorianDate: string;
  timeWIB: string;
  description: string;
}

