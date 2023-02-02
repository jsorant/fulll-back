export interface FleetInterface {
  id: string;
  userId: string;
  vehicles: Array<VehicleInterface>;
}

export interface VehicleInterface {
  id: string;
  plateNumber: string;
  location?: LocationInterface;
}

export interface LocationInterface {
  latitudeDegrees: number;
  longitudeDegrees: number;
  altitudeMeters?: number;
}
