import { Vehicle } from "../Vehicle/Vehicle";
import { Fleet } from "../Fleet/Fleet";

export class RegisterVehicle {
  register(vehicle: Vehicle, fleet: Fleet) {
    vehicle.registerToFleet(fleet.id.value);
    fleet.registerVehicle(vehicle.id.value);
  }

  // TODO: Aggregate consistency issue:
  //
  // 3 entries to register vehicle : service, vehicle, fleet
  // The correct way is the service (which updates both vehicle & fleet)
  // How do we ensure that a Command never only call the vehicle or fleet's method ?
  // How to have only one entry point (service) and make vehicle & fleet aggregates
  // related functions only accessible by the service ?
}
