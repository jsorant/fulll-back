import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";

export class FleetProjectionsAdapter {
  adaptFromMongo(fleet: any): FleetProjection {
    return {
      id: fleet.id,
      userId: fleet.userId,
    };
  }

  adaptVehiclesFromMongo(fleet: any): VehiclesProjection {
    console.log(fleet);
    return {
      vehiclePlateNumbers: [],
    };
  }
}
