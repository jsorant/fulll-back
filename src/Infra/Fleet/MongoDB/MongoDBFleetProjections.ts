import { connect, disconnect } from "mongoose";
import fleet from "../../../../fleet";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";
import { FleetModel } from "./Documents/FleetDocument";
import { FleetProjectionsAdapter } from "./FleetProjectionsAdapter";

export class MongoDBFleetProjections implements FleetProjections {
  private mongoUri: string;
  private adapter: FleetProjectionsAdapter;

  constructor(mongoUri: string, adapter: FleetProjectionsAdapter) {
    this.mongoUri = mongoUri;
    this.adapter = adapter;
  }

  async getFleetProjectionForUser(userId: string): Promise<FleetProjection> {
    await connect(this.mongoUri);

    FleetModel.find().where("userId").equals(userId);

    const doc = new FleetModel(this.adapter.fromMongo(fleet));
    await doc.save();

    await disconnect();

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
