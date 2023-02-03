import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";

export class FleetProjectionsAdapter {
  adaptFromMongo(fleet: any): FleetProjection {
    return {
      id: fleet.id,
      userId: fleet.userId,
    };
  }

  adaptVehiclesFromMongo(fleet: any): VehiclesProjection {
    return {
      vehiclePlateNumbers: [],
    };
  }

  adaptLocationFromMongo(location: any): LocationProjection {
    return {
      latitudeDegrees: location.latitudeDegrees,
      longitudeDegrees: location.longitudeDegrees,
      altitudeMeters: location.altitudeMeters,
    };
  }
}
