import { VehiclesProjection } from "../../App/Fleet/Queries/Views/VehiclesProjection";
import { LocationProjection } from "../../App/Fleet/Queries/Views/LocationProjection";
import { Fleet } from "../../Domain/Fleet/Fleet";
import { FleetProjection } from "../../App/Fleet/Queries/Views/FleetProjection";
import { Location } from "../../Domain/Fleet/ValueObjects/Location";

export class InMemoryProjectionAdapter {
  adaptToFleetProjection(fleet: Fleet): FleetProjection {
    return {
      id: fleet.getId(),
      userId: fleet.getUserId(),
    };
  }

  adaptToVehiclesProjection(fleet: Fleet): VehiclesProjection {
    return {
      vehiclePlateNumbers: fleet
        .getVehicles()
        .map((vehicle) => vehicle.getPlateNumber().toString()),
    };
  }

  adaptToLocationProjection(location: Location): LocationProjection {
    return {
      latitudeDegrees: location.latitudeDegrees,
      longitudeDegrees: location.longitudeDegrees,
      altitudeMeters: location.altitudeMeters,
    };
  }
}
