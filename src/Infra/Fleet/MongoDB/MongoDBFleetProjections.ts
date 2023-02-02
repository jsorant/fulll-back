import { MongoClient } from "mongodb";
import { connect, disconnect } from "mongoose";
import fleet from "../../../../fleet";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";

import { FleetProjectionsAdapter } from "./FleetProjectionsAdapter";

const DBNAME: string = "fulll-backend";
const COLLECTIONNAME: string = "fleets";

export class MongoDBFleetProjections implements FleetProjections {
  private adapter: FleetProjectionsAdapter;
  private client: MongoClient;

  constructor(mongoUri: string, adapter: FleetProjectionsAdapter) {
    this.client = new MongoClient(mongoUri);
    this.adapter = adapter;
  }

  async getFleetProjectionForUser(userId: string): Promise<FleetProjection> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    const findResult = await collection.findOne({ userId });

    await this.client.close();

    if (findResult === null) {
      throw new Error("Fleet not found for user id: " + userId);
    }

    return this.adapter.adaptFromMongo(findResult);
  }

  async getVehiclesProjectionOfFleet(
    fleetId: string
  ): Promise<VehiclesProjection> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    const findResult = await collection.findOne({ fleetId });

    await this.client.close();

    if (findResult === null) {
      throw new Error("Fleet not found for id: " + fleetId);
    }

    return this.adapter.adaptVehiclesFromMongo(findResult);
  }

  async getVehicleLocationProjection(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    throw new Error("Method not implemented.");
  }
}
