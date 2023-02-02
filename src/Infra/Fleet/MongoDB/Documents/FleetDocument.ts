export interface FleetInterface {
  id: string;
  userId: string;
  vehicles: Array<VehicleInterface>;
}

export interface VehicleInterface {
  id: string;
  plateNumber: string;
}
