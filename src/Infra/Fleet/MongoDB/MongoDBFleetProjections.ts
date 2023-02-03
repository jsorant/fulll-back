import { MongoClient } from "mongodb";
import { connect, disconnect } from "mongoose";
import { cpuUsage } from "process";
import fleet from "../../../../fleet";
import { FleetProjections } from "../../../App/Fleet/Queries/Ports/FleetProjections";
import { FleetProjection } from "../../../App/Fleet/Queries/Views/FleetProjection";
import { LocationProjection } from "../../../App/Fleet/Queries/Views/LocationProjection";
import { VehiclesProjection } from "../../../App/Fleet/Queries/Views/VehiclesProjection";
import { Vehicle } from "../../../Domain/Fleet/Entities/Vehicle";

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

  async getFleetForUser(userId: string): Promise<FleetProjection> {
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

    const findResult = await collection.findOne({ id: fleetId });

    await this.client.close();

    if (findResult === null) {
      throw new Error("Fleet not found for id: " + fleetId);
    }

    return this.adapter.adaptVehiclesFromMongo(findResult);
  }

  async getVehicleLocation(
    fleetId: string,
    plateNumber: string
  ): Promise<LocationProjection> {
    await this.client.connect();
    const collection = this.client.db(DBNAME).collection(COLLECTIONNAME);

    const findResult = await collection.findOne({ id: fleetId });

    await this.client.close();

    if (findResult === null) {
      throw new Error("Fleet not found for id: " + fleetId);
    }

    const foundVehicle = (findResult.vehicles as Array<any>).find(
      (vehicle) => vehicle.plateNumber == plateNumber
    );

    if (foundVehicle === undefined) {
      throw new Error("Vehicle not found. Plate number: " + plateNumber);
    }

    if (foundVehicle.location === undefined) {
      throw new Error(
        "No location found for given vehicle. Plate number: " + plateNumber
      );
    }

    return this.adapter.adaptLocationFromMongo(foundVehicle.location);
  }
}
