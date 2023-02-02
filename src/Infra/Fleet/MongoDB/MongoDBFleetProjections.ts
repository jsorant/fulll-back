import { MongoClient } from "mongodb";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";

export class MongoDBFleetProjections implements FleetProjections {
  private static DATABASE_NAME: string = "fulll-backend";
  private static COLLECTION_NAME: string = "fleets";

  //private database: Db;

  constructor(mongoUri: string) {}
  async getFleetProjectionForUser(userId: string): Promise<FleetProjection> {
    return {
      id: "result.id",
      userId: "result.userId",
    };
  }

  async getVehiclesProjectionOfFleet(
    fleetId: string
  ): Promise<VehiclesProjection> {
    throw new Error("Method not implemented.");
  }

  async getVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    throw new Error("Method not implemented.");
  }
}
