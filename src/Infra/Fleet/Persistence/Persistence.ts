import { FleetsRepository } from "../../../App/Fleet/Commands/Ports/FleetsRepository";
import { VehiclesRepository } from "../../../App/Fleet/Commands/Ports/VehiclesRepository";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { LocationProjections } from "../../../App/Fleet/Queries/Ports/LocationProjections";

export interface Persistence {
  getFleetsRepository(): FleetsRepository;
  getVehiclesRepository(): VehiclesRepository;
  getFleetProjections(): FleetProjections;
  getLocationProjections(): LocationProjections;
}
