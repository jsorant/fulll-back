import { SharedMemory } from "./SharedMemory";
import { LocationProjections } from "../../../../App/Queries/Ports/LocationProjections";
import { LocationProjection } from "../../../../App/Queries/Views/LocationProjection";
import { Location } from "../../../../Domain/Vehicle/ValueObjects/Location";

export class InMemoryLocationProjections implements LocationProjections {
  private sharedMemory: SharedMemory;

  constructor(sharedMemory: SharedMemory) {
    this.sharedMemory = sharedMemory;
  }

  async getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    const location: Location =
      this.sharedMemory.findLocationOrThrow(plateNumber);
    return this.adaptToLocationProjection(location);
  }

  private adaptToLocationProjection(location: Location): LocationProjection {
    return {
      latitudeDegrees: location.latitude.degrees,
      longitudeDegrees: location.longitude.degrees,
      altitudeMeters: location.altitude?.meters,
    };
  }
}
