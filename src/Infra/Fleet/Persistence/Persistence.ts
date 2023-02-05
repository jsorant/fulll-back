import { FleetsRepository } from "../../../App/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "../../../App/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "../../../App/Queries/Ports/FleetProjections";
import { LocationProjections } from "../../../App/Queries/Ports/LocationProjections";

export interface Persistence {
  reset(): Promise<void>;
  getFleetsRepository(): FleetsRepository;
  getVehiclesRepository(): VehiclesRepository;
  getFleetProjections(): FleetProjections;
  getLocationProjections(): LocationProjections;
}
